import { supabase } from './supabase';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  environment: string;
}

class Logger {
  private static instance: Logger;
  private buffer: LogEntry[] = [];
  private readonly bufferSize = 100;
  private readonly environment = import.meta.env.MODE;
  private flushInterval: number;
  private sessionId: string;

  private constructor() {
    this.sessionId = crypto.randomUUID();
    this.flushInterval = setInterval(() => this.flush(), 30000); // Flush every 30 seconds
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private async flush() {
    if (this.buffer.length === 0) return;

    if (import.meta.env.PROD) {
      try {
        const { error } = await supabase
          .from('logs')
          .insert(this.buffer);

        if (error) {
          console.error('Error flushing logs:', error);
          return;
        }

        this.buffer = [];
      } catch (error) {
        console.error('Error flushing logs:', error);
      }
    }
  }

  private async log(level: LogLevel, message: string, context?: Record<string, any>) {
    const userId = (await supabase.auth.getUser()).data.user?.id;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userId,
      sessionId: this.sessionId,
      environment: this.environment
    };

    // Add to buffer
    this.buffer.push(entry);
    if (this.buffer.length > this.bufferSize) {
      await this.flush();
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      const logFn = console[level] || console.log;
      logFn(`[${level.toUpperCase()}] ${message}`, context);
    }
  }

  debug(message: string, context?: Record<string, any>) {
    return this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    return this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    return this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>) {
    return this.log('error', message, context);
  }

  getRecentLogs(): LogEntry[] {
    return [...this.buffer];
  }

  async clearBuffer() {
    await this.flush();
    this.buffer = [];
  }

  destroy() {
    clearInterval(this.flushInterval);
  }
}

export const logger = Logger.getInstance();