import { OpenAI } from 'openai';
import { toast } from 'sonner';
import { generateResponse } from './openai';
import { detectBusinessTesting } from './nlp';
import { useBFFStore } from './store';

const RASA_URL = import.meta.env.VITE_RASA_SERVER_URL;
const RASA_TOKEN = import.meta.env.VITE_RASA_TOKEN;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const CONNECTION_TIMEOUT = 10000; // 10 seconds
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

interface RasaResponse {
  recipient_id: string;
  text: string;
  image?: string;
  buttons?: Array<{ title: string; payload: string }>;
  custom?: {
    intent?: {
      name: string;
      confidence: number;
    };
    entities?: Array<{
      entity: string;
      value: string;
      confidence: number;
    }>;
    action?: string;
    amount?: number;
    context?: Record<string, any>;
  };
}

let rasaHealthy = true;
let lastHealthCheck = 0;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function checkRasaHealth(): Promise<boolean> {
  try {
    const now = Date.now();
    if (now - lastHealthCheck < HEALTH_CHECK_INTERVAL) {
      return rasaHealthy;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${RASA_URL}/health`, {
      headers: {
        'Authorization': `Bearer ${RASA_TOKEN}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    rasaHealthy = response.ok;
    lastHealthCheck = now;
    return rasaHealthy;
  } catch (error) {
    console.warn('Rasa health check failed:', error);
    rasaHealthy = false;
    lastHealthCheck = Date.now();
    return false;
  }
}

const fetchWithRetry = async (url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONNECTION_TIMEOUT);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Connection timeout');
    }
    
    if (retries > 0) {
      await delay(RETRY_DELAY * (MAX_RETRIES - retries + 1));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

export async function sendMessageToRasa(
  message: string,
  senderId: string = 'default',
  context?: Record<string, any>
): Promise<RasaResponse[]> {
  // Check if we have valid Rasa configuration
  if (!RASA_URL || !RASA_TOKEN) {
    console.warn('Missing Rasa configuration, falling back to OpenAI');
    return fallbackToOpenAI(message, senderId, context);
  }

  // Check Rasa health before attempting to send message
  const isHealthy = await checkRasaHealth();
  if (!isHealthy) {
    console.warn('Rasa health check failed, falling back to OpenAI');
    return fallbackToOpenAI(message, senderId, context);
  }

  const restaurantContext = useBFFStore.getState().restaurantContext;
  const businessTesting = detectBusinessTesting(message);
  
  const payload = {
    message,
    sender: senderId,
    metadata: {
      ...context,
      restaurant: restaurantContext,
      businessTesting,
      language: navigator.language,
      timestamp: new Date().toISOString()
    }
  };

  try {
    const response = await fetchWithRetry(
      `${RASA_URL}/webhooks/rest/webhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${RASA_TOKEN}`,
          'X-Request-ID': crypto.randomUUID()
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map(item => ({
        ...item,
        custom: {
          ...item.custom,
          context: restaurantContext,
          businessTesting,
          source: 'rasa'
        }
      }));
    }

    console.warn('Empty response from Rasa, falling back to OpenAI');
    return fallbackToOpenAI(message, senderId, context);
  } catch (error) {
    console.warn('Rasa error, falling back to OpenAI:', error);
    return fallbackToOpenAI(message, senderId, context);
  }
}

async function fallbackToOpenAI(
  message: string,
  senderId: string,
  context?: Record<string, any>
): Promise<RasaResponse[]> {
  try {
    const restaurantContext = useBFFStore.getState().restaurantContext;
    const businessTesting = detectBusinessTesting(message);

    const openAIResponse = await generateResponse(
      message,
      context?.messages?.map((m: any) => m.content).join('\n') || '',
      'neutral',
      navigator.language.split('-')[0],
      senderId,
      restaurantContext,
      businessTesting
    );

    return [{
      recipient_id: senderId,
      text: openAIResponse.content,
      custom: {
        menuItems: openAIResponse.menuItems,
        context: restaurantContext,
        businessTesting,
        source: 'openai',
        fallback: true
      }
    }];
  } catch (error) {
    console.error('OpenAI fallback error:', error);
    return [{
      recipient_id: senderId,
      text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
      custom: {
        error: true,
        fallback: true,
        source: 'error'
      }
    }];
  }
}