import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '../../lib/supabase';
import { generateResponse } from '../../lib/openai';

describe('Message Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('RLS Policies', () => {
    it('prevents reading other users messages', async () => {
      const mockSelect = vi.fn().mockResolvedValue({ data: [], error: { message: 'Not authorized' } });
      vi.spyOn(supabase, 'from').mockReturnValue({
        ...supabase.from('messages'),
        select: mockSelect,
      } as any);

      const { data, error } = await supabase
        .from('messages')
        .select()
        .eq('user_id', 'other-user-id');

      expect(error).toBeDefined();
      expect(data).toBeNull();
      expect(mockSelect).toHaveBeenCalled();
    });

    it('prevents modifying other users messages', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ error: { message: 'Not authorized' } });
      vi.spyOn(supabase, 'from').mockReturnValue({
        ...supabase.from('messages'),
        update: mockUpdate,
      } as any);

      const { error } = await supabase
        .from('messages')
        .update({ content: 'Modified content' })
        .eq('user_id', 'other-user-id');

      expect(error).toBeDefined();
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe('Message Generation', () => {
    it('handles empty input gracefully', async () => {
      const response = await generateResponse(
        '',
        '',
        'neutral',
        'en',
        'test-user'
      );

      expect(response.content).toBeDefined();
      expect(response.menuItems).toBeDefined();
    });

    it('handles Supabase insert failures gracefully', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: { message: 'Database error' } });
      vi.spyOn(supabase, 'from').mockReturnValue({
        ...supabase.from('messages'),
        insert: mockInsert,
      } as any);

      const response = await generateResponse(
        'Show me the menu',
        '',
        'neutral',
        'en',
        'test-user'
      );

      expect(response.content).toContain('most popular dishes');
      expect(response.menuItems).toBeDefined();
    });

    it('provides fallback responses on API failure', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));

      const response = await generateResponse(
        'Show me the menu',
        '',
        'neutral',
        'en',
        'test-user'
      );

      expect(response.content).toContain('most popular dishes');
      expect(response.menuItems).toBeDefined();
    });
  });
});