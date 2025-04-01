type CacheValue<T> = {
  value: T;
  expires: number;
};

interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items in cache
}

class Cache<T> {
  private cache: Map<string, CacheValue<T>> = new Map();
  private readonly maxSize: number;
  private readonly defaultTTL: number;

  constructor(options: CacheOptions = { ttl: 5 * 60 * 1000, maxSize: 1000 }) {
    this.defaultTTL = options.ttl;
    this.maxSize = options.maxSize || 1000;
  }

  set(key: string, value: T, options?: Partial<CacheOptions>): void {
    this.cleanup();

    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.findOldestKey();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const ttl = options?.ttl ?? this.defaultTTL;
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl
    });
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }

  private findOldestKey(): string | undefined {
    let oldestKey: string | undefined;
    let oldestTime = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.expires < oldestTime) {
        oldestTime = item.expires;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  size(): number {
    return this.cache.size;
  }
}

// Create cache instances for different data types
export const menuCache = new Cache<typeof import('../types').sampleMenu>();
export const responseCache = new Cache<string>({ ttl: 60 * 1000 }); // 1 minute TTL for responses
export const userCache = new Cache<Record<string, any>>({ ttl: 5 * 60 * 1000 }); // 5 minutes TTL for user data