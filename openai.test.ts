import { describe, it, expect, vi } from 'vitest';
import { generateResponse } from '../../lib/openai';
import { sampleMenu } from '../../types';

describe('OpenAI Integration', () => {
  it('should handle rate limiting', async () => {
    const userId = 'test-user';
    const requests = [];

    // Make multiple requests rapidly
    for (let i = 0; i < 60; i++) {
      requests.push(
        generateResponse(
          'Test message',
          'Test context',
          'neutral',
          'en',
          userId
        )
      );
    }

    const results = await Promise.allSettled(requests);
    const rateLimited = results.some(
      result => result.status === 'rejected' && 
      result.reason.message === 'Rate limit exceeded'
    );

    expect(rateLimited).toBe(true);
  });

  it('should return fallback response on API error', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));

    const response = await generateResponse(
      'Test message',
      'Test context',
      'neutral',
      'en',
      'test-user'
    );

    expect(response.content).toContain('most popular dishes');
    expect(response.menuItems).toBeDefined();
    expect(response.menuItems?.length).toBeGreaterThan(0);
  });
});