import { queryAll, runQuery } from './sqlClient';

type InventoryState = 'assigned' | 'available' | 'transfer' | 'faulty';
type LicenseStatus = 'active' | 'expiring' | 'awaiting';
type PrinterStatus = 'online' | 'warning' | 'maintenance';
type RequestStatus = 'open' | 'completed' | 'cancelled';

export interface InventoryEntity {
  id: string;
  inventoryNo: string;
  factory: string;
  department: string;
  responsible: string;
  responsibleRole: string;
  brand: string;
  model: string;
  state: InventoryState;
  detailRoute: string;
  createdAt: string;
}

export interface CreateInventoryPayload {
  id: string;
  inventoryNo: string;
  factory: string;
  department: string;
  responsible: string;
  responsibleRole: string;
  brand: string;
  model: string;
  state: InventoryState;
  detailRoute: string;
}

export const fetchInventoryRecords = async () =>
  queryAll<InventoryEntity>(
    `SELECT
      id,
      inventory_no AS inventoryNo,
      factory,
      department,
      responsible,
      responsible_role AS responsibleRole,
      brand,
      model,
      state,
      detail_route AS detailRoute,
      created_at AS createdAt
    FROM inventory_records
    ORDER BY datetime(created_at) DESC`
  );

export const insertInventoryRecord = async (payload: CreateInventoryPayload) => {
  await runQuery(
    `INSERT INTO inventory_records
      (id, inventory_no, factory, department, responsible, responsible_role, brand, model, state, detail_route)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.id,
      payload.inventoryNo,
      payload.factory,
      payload.department,
      payload.responsible,
      payload.responsibleRole,
      payload.brand,
      payload.model,
      payload.state,
      payload.detailRoute
    ]
  );
};

export interface LicenseEntity {
  id: number;
  name: string;
  licenseKey: string;
  owner: string;
  ownerRole: string;
  linkedUnits: string;
  email: string;
  status: LicenseStatus;
  note: string;
}

export const fetchLicenseRecords = async () =>
  queryAll<LicenseEntity>(
    `SELECT
      id,
      name,
      license_key AS licenseKey,
      owner,
      owner_role AS ownerRole,
      linked_units AS linkedUnits,
      email,
      status,
      note
    FROM license_records
    ORDER BY id DESC`
  );

export const updateLicenseRecord = async (id: number, status: LicenseStatus, note: string) =>
  runQuery(
    `UPDATE license_records
      SET status = ?,
          note = ?
    WHERE id = ?`,
    [status, note, id]
  );

export interface PrinterEntity {
  assetId: string;
  name: string;
  location: string;
  supply: string;
  status: PrinterStatus;
}

export const fetchPrinters = async () =>
  queryAll<PrinterEntity>(
    `SELECT
      asset_id AS assetId,
      name,
      location,
      supply,
      status
    FROM printer_records
    ORDER BY asset_id`
  );

export interface PrinterLogEntity {
  id: number;
  entryTime: string;
  description: string;
  linkLabel: string;
}

export const fetchPrinterLogs = async () =>
  queryAll<PrinterLogEntity>(
    `SELECT
      id,
      entry_time AS entryTime,
      description,
      link_label AS linkLabel
    FROM printer_logs
    ORDER BY id DESC`
  );

export interface StockEntity {
  id: number;
  ifsNo: string;
  itemType: string;
  brand: string;
  model: string;
  quantity: string;
  eventDate: string;
  description: string;
  category: string;
  cancelReason: string | null;
}

export const fetchStockRecords = async () =>
  queryAll<StockEntity>(
    `SELECT
      id,
      ifs_no AS ifsNo,
      item_type AS itemType,
      brand,
      model,
      quantity,
      event_date AS eventDate,
      description,
      category,
      cancel_reason AS cancelReason
    FROM stock_records
    ORDER BY id DESC`
  );

export const updateStockDescription = async (id: number, description: string, cancelReason: string | null) =>
  runQuery(
    `UPDATE stock_records
      SET description = ?,
          cancel_reason = ?
    WHERE id = ?`,
    [description, cancelReason, id]
  );

export interface RequestEntity {
  id: string;
  ifsNo: string;
  status: RequestStatus;
  hardwareType: string;
  brand: string;
  model: string;
  quantity: string;
  eventDate: string;
  note: string;
  targetRoute: string;
  targetLabel: string;
  cancellationReason: string | null;
}

export const fetchRequestRecords = async () =>
  queryAll<RequestEntity>(
    `SELECT
      id,
      ifs_no AS ifsNo,
      status,
      hardware_type AS hardwareType,
      brand,
      model,
      quantity,
      event_date AS eventDate,
      note,
      target_route AS targetRoute,
      target_label AS targetLabel,
      cancellation_reason AS cancellationReason
    FROM request_records
    ORDER BY event_date DESC, id DESC`
  );

export const insertRequestRecord = async (record: RequestEntity) => {
  await runQuery(
    `INSERT INTO request_records
      (id, ifs_no, status, hardware_type, brand, model, quantity, event_date, note, target_route, target_label, cancellation_reason)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      record.id,
      record.ifsNo,
      record.status,
      record.hardwareType,
      record.brand,
      record.model,
      record.quantity,
      record.eventDate,
      record.note,
      record.targetRoute,
      record.targetLabel,
      record.cancellationReason ?? null
    ]
  );
};

export const updateRequestRecord = async (
  id: string,
  updates: Partial<Pick<RequestEntity, 'status' | 'note' | 'eventDate' | 'cancellationReason'>>
) => {
  await runQuery(
    `UPDATE request_records
      SET status = COALESCE(?, status),
          note = COALESCE(?, note),
          event_date = COALESCE(?, event_date),
          cancellation_reason = ?
    WHERE id = ?`,
    [
      updates.status ?? null,
      updates.note ?? null,
      updates.eventDate ?? null,
      updates.cancellationReason ?? null,
      id
    ]
  );
};

export interface ScrapEvaluationEntity {
  id: string;
  asset: string;
  tag: string;
  status: string;
  requestId: string;
  updatedAt: string;
}

export interface ScrapCompletedEntity {
  id: string;
  asset: string;
  serial: string;
  location: string;
  note: string;
  relatedLabel: string;
}

export const fetchScrapEvaluation = async () =>
  queryAll<ScrapEvaluationEntity>(
    `SELECT
      id,
      asset,
      tag,
      status,
      request_id AS requestId,
      updated_at AS updatedAt
    FROM scrap_evaluation_records
    ORDER BY updated_at DESC`
  );

export const fetchScrapCompleted = async () =>
  queryAll<ScrapCompletedEntity>(
    `SELECT
      id,
      asset,
      serial,
      location,
      note,
      related_label AS relatedLabel
    FROM scrap_completed_records
    ORDER BY id DESC`
  );

export interface AuditMetricEntity {
  id: string;
  label: string;
  value: string;
  note: string;
}

export const fetchAuditMetrics = async () =>
  queryAll<AuditMetricEntity>(`SELECT id, label, value, note FROM audit_metrics ORDER BY id`);

export interface AuditLogEntity {
  id: number;
  title: string;
  detail: string;
  eventTime: string;
  actor: string;
  routeName: string;
  linkLabel: string;
}

export const fetchAuditLogs = async () =>
  queryAll<AuditLogEntity>(
    `SELECT
      id,
      title,
      detail,
      event_time AS eventTime,
      actor,
      route_name AS routeName,
      link_label AS linkLabel
    FROM audit_logs
    ORDER BY id DESC`
  );

export interface AuditInsightEntity {
  id: number;
  title: string;
  note: string;
  routeName: string;
  linkLabel: string;
}

export const fetchAuditInsights = async () =>
  queryAll<AuditInsightEntity>(
    `SELECT
      id,
      title,
      note,
      route_name AS routeName,
      link_label AS linkLabel
    FROM audit_insights
    ORDER BY id DESC`
  );
