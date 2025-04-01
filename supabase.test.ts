import { describe, it, expect, beforeEach } from 'vitest';
import { supabase } from '../../lib/supabase';

describe('Supabase Integration', () => {
  beforeEach(() => {
    // Clear any authenticated session
    supabase.auth.signOut();
  });

  it('handles message creation', async () => {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        content: 'Test message',
        user_message: true,
        language: 'en'
      });

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('enforces RLS policies', async () => {
    // Try to read messages without authentication
    const { data, error } = await supabase
      .from('messages')
      .select('*');

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });

  it('handles conversation creation and messages', async () => {
    // Create a conversation
    const { data: conversation } = await supabase
      .from('conversations')
      .insert({
        title: 'Test Conversation'
      })
      .select()
      .single();

    expect(conversation).toBeDefined();

    // Add message to conversation
    const { data: message } = await supabase
      .from('messages')
      .insert({
        content: 'Test message',
        conversation_id: conversation?.id,
        user_message: true
      })
      .select()
      .single();

    expect(message).toBeDefined();
    expect(message?.conversation_id).toBe(conversation?.id);
  });
});