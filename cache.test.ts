import { describe, it, expect, beforeEach } from 'vitest';
import { Cache } from '../../lib/cache';

describe('Cache', () => {
  let cache: Cache<string>;

  beforeEach(() => {
    cache = new Cache({ ttl: 1000 }); // 1 second TTL for testing
  });

  it('should store and retrieve values', () => {
    cache.set('test', 'value');
    expect(cache.get('test')).toBe('value');
  });

  it('should respect TTL', async () => {
    cache.set('test', 'value', { ttl: 50 }); // 50ms TTL
    expect(cache.get('test')).toBe('value');
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(cache.get('test')).toBeUndefined();
  });

  it('should respect max size', () => {
    const smallCache = new Cache<string>({ ttl: 1000, maxSize: 2 });
    
    smallCache.set('key1', 'value1');
    smallCache.set('key2', 'value2');
    smallCache.set('key3', 'value3');

    expect(smallCache.size()).toBe(2);
    expect(smallCache.get('key1')).toBeUndefined();
  });

  it('should clear all values', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    
    cache.clear();
    
    expect(cache.size()).toBe(0);
    expect(cache.get('key1')).toBeUndefined();
    expect(cache.get('key2')).toBeUndefined();
  });
});