/**
 * Request-bound logger implementation
 */

import { Request } from 'express';
import { Logger } from '../types';

/**
 * Creates a request-bound logger instance
 * @param requestId - Unique request identifier
 * @param req - Express request object
 * @returns Logger instance
 */
export function createLogger(requestId: string, req: Request): Logger {
  const logWithContext = (level: string, message: string, meta?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    const context = {
      timestamp,
      requestId,
      method: req.method,
      url: req.url,
      ip: req.ip || req.socket.remoteAddress,
      ...meta,
    };

    const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${requestId}] ${message}`;
    const logData = JSON.stringify(context, null, 2);

    switch (level) {
      case 'debug':
        console.debug(logMessage, '\n', logData);
        break;
      case 'info':
        console.info(logMessage, '\n', logData);
        break;
      case 'warn':
        console.warn(logMessage, '\n', logData);
        break;
      case 'error':
        console.error(logMessage, '\n', logData);
        break;
      default:
        console.log(logMessage, '\n', logData);
    }
  };

  return {
    debug: (message: string, meta?: Record<string, unknown>) => {
      logWithContext('debug', message, meta);
    },
    info: (message: string, meta?: Record<string, unknown>) => {
      logWithContext('info', message, meta);
    },
    warn: (message: string, meta?: Record<string, unknown>) => {
      logWithContext('warn', message, meta);
    },
    error: (message: string, meta?: Record<string, unknown>) => {
      logWithContext('error', message, meta);
    },
  };
}
