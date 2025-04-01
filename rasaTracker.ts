import { supabase } from './supabase';

export interface ConversationState {
  userId: string;
  sessionId: string;
  slots: Record<string, any>;
  events: any[];
  language: string;
  lastAction?: string;
  lastResponse?: string;
  context?: Record<string, any>;
}

export const trackConversation = async (state: ConversationState) => {
  const { data, error } = await supabase
    .from('conversations')
    .upsert({
      user_id: state.userId,
      session_id: state.sessionId,
      slots: state.slots,
      events: state.events,
      language: state.language,
      last_action: state.lastAction,
      last_response: state.lastResponse,
      context: state.context,
      updated_at: new Date()
    })
    .select();

  if (error) throw error;
  return data;
};

export const getConversationState = async (sessionId: string): Promise<ConversationState | null> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error) return null;
  return data as ConversationState;
};

export const clearConversation = async (sessionId: string) => {
  await supabase
    .from('conversations')
    .delete()
    .eq('session_id', sessionId);
};