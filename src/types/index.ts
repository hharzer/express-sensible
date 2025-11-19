/**
 * Type definitions for express-sensible
 */

import { Application, Request, Response } from 'express';

/**
 * Logger interface for request-bound logging
 */
export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

/**
 * Application configuration interface
 */
export interface AppConfig {
  [key: string]: unknown;
}

/**
 * Request context stored in AsyncLocalStorage
 */
export interface RequestContextData {
  app: Application;
  req: Request;
  res: Response;
  config: AppConfig;
  logger: Logger;
  requestId: string;
  startTime: number;
  metadata: Map<string, unknown>;
}
