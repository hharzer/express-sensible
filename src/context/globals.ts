/**
 * Global context accessors for request-specific data
 */

import { Application, Request, Response } from 'express';
import { getContext } from './async-context';
import { AppConfig, Logger } from '../types';

/**
 * Gets the current Express application instance
 * @throws Error if called outside of request context
 * @returns The Express application
 */
export function $app(): Application {
  const context = getContext();
  if (!context) {
    throw new Error('$app() can only be called within a request context');
  }
  return context.app;
}

/**
 * Gets the current Express request object
 * @throws Error if called outside of request context
 * @returns The Express request
 */
export function $req(): Request {
  const context = getContext();
  if (!context) {
    throw new Error('$req() can only be called within a request context');
  }
  return context.req;
}

/**
 * Gets the current Express response object
 * @throws Error if called outside of request context
 * @returns The Express response
 */
export function $res(): Response {
  const context = getContext();
  if (!context) {
    throw new Error('$res() can only be called within a request context');
  }
  return context.res;
}

/**
 * Gets the application configuration
 * @throws Error if called outside of request context
 * @returns The application config
 */
export function $config(): AppConfig {
  const context = getContext();
  if (!context) {
    throw new Error('$config() can only be called within a request context');
  }
  return context.config;
}

/**
 * Gets the request-bound logger instance
 * @throws Error if called outside of request context
 * @returns The logger instance
 */
export function $logger(): Logger {
  const context = getContext();
  if (!context) {
    throw new Error('$logger() can only be called within a request context');
  }
  return context.logger;
}
