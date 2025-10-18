interface SQLError {
  code: number;
  message: string;
}

interface WebSqlResultSet {
  insertId?: number;
  rowsAffected: number;
  rows: {
    length: number;
    item: (index: number) => unknown;
  };
}

interface WebSqlTransaction {
  executeSql: (
    sqlStatement: string,
    args?: unknown[],
    callback?: (transaction: WebSqlTransaction, resultSet: WebSqlResultSet) => void,
    errorCallback?: (transaction: WebSqlTransaction, error: SQLError) => void
  ) => void;
}

interface WebSqlDatabase {
  transaction: (
    callback: (transaction: WebSqlTransaction) => void,
    errorCallback?: (error: SQLError) => void,
    successCallback?: () => void
  ) => void;
}

interface WebSqlWindow extends Window {
  openDatabase?: (name: string, version: string, displayName: string, estimatedSize: number) => WebSqlDatabase;
}

const DB_NAME = 'ifs_ops';
const DB_VERSION = '1.0';
const DB_DISPLAY_NAME = 'IFS Operations Data';
const DB_SIZE = 5 * 1024 * 1024; // 5MB

let database: WebSqlDatabase | null = null;

const ensureDatabase = () => {
  if (typeof window === 'undefined') {
    throw new Error('WebSQL bu ortamda desteklenmiyor.');
  }

  const webSqlWindow = window as WebSqlWindow;

  if (typeof webSqlWindow.openDatabase !== 'function') {
    throw new Error('WebSQL bu ortamda desteklenmiyor.');
  }

  if (!database) {
    database = webSqlWindow.openDatabase(DB_NAME, DB_VERSION, DB_DISPLAY_NAME, DB_SIZE);
    initializeSchema(database);
  }

  return database;
};

const initializeSchema = (db: WebSqlDatabase) => {
  db.transaction((tx: WebSqlTransaction) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS inventory_records (
        id TEXT PRIMARY KEY,
        inventory_no TEXT NOT NULL,
        factory TEXT NOT NULL,
        department TEXT NOT NULL,
        responsible TEXT NOT NULL,
        responsible_role TEXT NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        state TEXT NOT NULL CHECK(state IN ('assigned','available','transfer','faulty')),
        detail_route TEXT NOT NULL DEFAULT 'stock-tracking',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS license_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        license_key TEXT NOT NULL,
        owner TEXT NOT NULL,
        owner_role TEXT NOT NULL,
        linked_units TEXT NOT NULL,
        email TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('active','expiring','awaiting')),
        note TEXT DEFAULT ''
      )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS printer_records (
        asset_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        supply TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('online','warning','maintenance'))
      )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS printer_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entry_time TEXT NOT NULL,
        description TEXT NOT NULL,
        link_label TEXT DEFAULT ''
      )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS stock_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ifs_no TEXT NOT NULL,
        item_type TEXT NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        quantity TEXT NOT NULL,
        event_date TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        cancel_reason TEXT DEFAULT NULL
      )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS request_records (
        id TEXT PRIMARY KEY,
        ifs_no TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('open','completed','cancelled')),
        hardware_type TEXT NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        quantity TEXT NOT NULL,
        event_date TEXT NOT NULL,
        note TEXT NOT NULL,
        target_route TEXT NOT NULL,
        target_label TEXT NOT NULL,
        cancellation_reason TEXT DEFAULT NULL
      )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS scrap_evaluation_records (
        id TEXT PRIMARY KEY,
        asset TEXT NOT NULL,
        tag TEXT NOT NULL,
        status TEXT NOT NULL,
        request_id TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS scrap_completed_records (
        id TEXT PRIMARY KEY,
        asset TEXT NOT NULL,
        serial TEXT NOT NULL,
        location TEXT NOT NULL,
        note TEXT NOT NULL,
        related_label TEXT NOT NULL
      )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS audit_metrics (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        value TEXT NOT NULL,
        note TEXT NOT NULL
      )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        detail TEXT NOT NULL,
        event_time TEXT NOT NULL,
        actor TEXT NOT NULL,
        route_name TEXT NOT NULL,
        link_label TEXT NOT NULL
      )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS audit_insights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        note TEXT NOT NULL,
        route_name TEXT NOT NULL,
        link_label TEXT NOT NULL
      )`
    );
  });
};

const executeSql = (sql: string, params: unknown[] = []) =>
  new Promise<WebSqlResultSet>((resolve, reject) => {
    const db = ensureDatabase();

    db.transaction(
      (tx: WebSqlTransaction) => {
        tx.executeSql(
          sql,
          params,
          (_tx: WebSqlTransaction, result: WebSqlResultSet) => {
            resolve(result);
          },
          (_tx: WebSqlTransaction, error: SQLError) => {
            reject(error);
            return false;
          }
        );
      },
      (error: SQLError) => {
        reject(error);
      }
    );
  });

export const runQuery = (sql: string, params: unknown[] = []) => executeSql(sql, params).then(() => undefined);

export const queryAll = async <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => {
  const result = await executeSql(sql, params);
  const items: T[] = [];

  for (let index = 0; index < result.rows.length; index += 1) {
    items.push(result.rows.item(index) as T);
  }

  return items;
};

export const queryOne = async <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => {
  const [row] = await queryAll<T>(sql, params);
  return row ?? null;
};
