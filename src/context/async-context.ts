/**
 * AsyncLocalStorage-based request context management
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import { Application, Request, Response } from 'express';
import { RequestContextData, Logger, AppConfig } from '../types';
import { createLogger } from './logger';

/**
 * Global AsyncLocalStorage instance for request context
 */
const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

/**
 * Request context class with helper methods
 */
export class RequestContext {
  private data: RequestContextData;

  /**
   * Creates a new RequestContext
   * @param app - Express application instance
   * @param req - Express request object
   * @param res - Express response object
   * @param config - Application configuration
   * @param requestId - Unique request identifier
   */
  constructor(
    app: Application,
    req: Request,
    res: Response,
    config: AppConfig,
    requestId: string
  ) {
    this.data = {
      app,
      req,
      res,
      config,
      logger: createLogger(requestId, req),
      requestId,
      startTime: Date.now(),
      metadata: new Map<string, unknown>(),
    };
  }

  /**
   * Gets the Express application instance
   */
  get app(): Application {
    return this.data.app;
  }

  /**
   * Gets the Express request object
   */
  get req(): Request {
    return this.data.req;
  }

  /**
   * Gets the Express response object
   */
  get res(): Response {
    return this.data.res;
  }

  /**
   * Gets the application configuration
   */
  get config(): AppConfig {
    return this.data.config;
  }

  /**
   * Gets the request-bound logger instance
   */
  get logger(): Logger {
    return this.data.logger;
  }

  /**
   * Gets the unique request ID
   */
  get requestId(): string {
    return this.data.requestId;
  }

  /**
   * Gets the request start time in milliseconds
   */
  get startTime(): number {
    return this.data.startTime;
  }

  /**
   * Gets the elapsed time since request start in milliseconds
   */
  get elapsedTime(): number {
    return Date.now() - this.data.startTime;
  }

  /**
   * Sets a metadata value
   * @param key - Metadata key
   * @param value - Metadata value
   */
  setMetadata(key: string, value: unknown): void {
    this.data.metadata.set(key, value);
  }

  /**
   * Gets a metadata value
   * @param key - Metadata key
   * @returns The metadata value or undefined
   */
  getMetadata<T = unknown>(key: string): T | undefined {
    return this.data.metadata.get(key) as T | undefined;
  }

  /**
   * Checks if metadata exists
   * @param key - Metadata key
   * @returns True if the metadata exists
   */
  hasMetadata(key: string): boolean {
    return this.data.metadata.has(key);
  }

  /**
   * Deletes a metadata value
   * @param key - Metadata key
   * @returns True if the metadata was deleted
   */
  deleteMetadata(key: string): boolean {
    return this.data.metadata.delete(key);
  }

  /**
   * Gets all metadata as an object
   * @returns Object containing all metadata
   */
  getAllMetadata(): Record<string, unknown> {
    return Object.fromEntries(this.data.metadata);
  }

  /**
   * Clears all metadata
   */
  clearMetadata(): void {
    this.data.metadata.clear();
  }
}

/**
 * Gets the current request context
 * @returns The current RequestContext or undefined if not in a request context
 */
export function getContext(): RequestContext | undefined {
  return asyncLocalStorage.getStore();
}

/**
 * Runs a function within a request context
 * @param context - The request context to use
 * @param fn - The function to run
 * @returns The result of the function
 */
export function runInContext<T>(context: RequestContext, fn: () => T): T {
  return asyncLocalStorage.run(context, fn);
}

/**
 * Express middleware to create and manage async context
 * @param config - Application configuration
 * @returns Express middleware function
 */
export function asyncContext(config: AppConfig = {}) {
  return (req: Request, res: Response, next: () => void) => {
    const requestId = (req.headers['x-request-id'] as string) || generateRequestId();
    const context = new RequestContext(req.app, req, res, config, requestId);

    runInContext(context, () => {
      next();
    });
  };
}

/**
 * Generates a unique request ID
 * @returns A unique request ID string
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
