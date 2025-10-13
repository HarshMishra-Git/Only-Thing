import { Pool, PoolClient, QueryResult } from 'pg';
import { logger } from './logger';

let pool: Pool | null = null;

export interface DatabaseConfig {
  connectionString: string;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

export function initializeDatabase(config: DatabaseConfig): Pool {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    connectionString: config.connectionString,
    max: config.max || 20,
    idleTimeoutMillis: config.idleTimeoutMillis || 30000,
    connectionTimeoutMillis: config.connectionTimeoutMillis || 2000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  pool.on('error', (err) => {
    logger.error({ err }, 'Unexpected database pool error');
  });

  logger.info('Database connection pool initialized');
  return pool;
}

export function getPool(): Pool {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initializeDatabase first.');
  }
  return pool;
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const client = getPool();
  
  try {
    const result = await client.query<T>(text, params);
    const duration = Date.now() - start;
    
    logger.debug({ text, duration, rows: result.rowCount }, 'Database query executed');
    return result;
  } catch (error) {
    logger.error({ error, text, params }, 'Database query error');
    throw error;
  }
}

export async function getClient(): Promise<PoolClient> {
  return getPool().connect();
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Database connection pool closed');
  }
}

export default {
  initializeDatabase,
  getPool,
  query,
  getClient,
  transaction,
  closeDatabase,
};
