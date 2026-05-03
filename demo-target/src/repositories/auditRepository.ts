import { db } from '../lib/database';

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

export interface CreateAuditLogData {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

class AuditRepository {
  async create(auditData: CreateAuditLogData): Promise<AuditLog> {
    // VIOLATION: Rule 5.1 - Using console.log instead of centralized logger
    // This is a plausible violation - developer adds debug logging and forgets to use the logger
    console.log('Creating audit log:', {
      action: auditData.action,
      resourceType: auditData.resourceType,
      resourceId: auditData.resourceId,
    });

    const result = await db.queryOne<AuditLog>(
      `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, metadata, ip_address, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [
        auditData.userId,
        auditData.action,
        auditData.resourceType,
        auditData.resourceId,
        JSON.stringify(auditData.metadata || {}),
        auditData.ipAddress,
      ]
    );
    return result!;
  }

  async findByUserId(userId: string, limit: number = 100): Promise<AuditLog[]> {
    console.log(`Fetching audit logs for user: ${userId}`);
    const results = await db.query<AuditLog>(
      'SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return results;
  }

  async findByResource(resourceType: string, resourceId: string): Promise<AuditLog[]> {
    console.log(`Fetching audit logs for resource: ${resourceType}/${resourceId}`);
    const results = await db.query<AuditLog>(
      'SELECT * FROM audit_logs WHERE resource_type = $1 AND resource_id = $2 ORDER BY created_at DESC',
      [resourceType, resourceId]
    );
    return results;
  }

  async findRecent(limit: number = 100): Promise<AuditLog[]> {
    const results = await db.query<AuditLog>(
      'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return results;
  }
}

export const auditRepository = new AuditRepository();

// Made with Bob
