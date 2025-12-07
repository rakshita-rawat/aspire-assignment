import { pool } from '../config/database';
import { logger } from './logger';
import { DatabaseError } from '../errors/app.errors';

export const query = async (text: string, params?: unknown[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { 
      text: text.substring(0, 100),
      duration, 
      rows: res.rowCount 
    });
    return res;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    logger.error('Database query failed', {
      query: text.substring(0, 100),
      error: errorMessage,
    });
    throw new DatabaseError('Query execution failed', error instanceof Error ? error : undefined);
  }
};

export default pool;

