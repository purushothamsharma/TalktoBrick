import axios from 'axios';

const RASA_ENDPOINT = 'http://localhost:5005/webhooks/rest/webhook';

export interface RasaResponse {
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
    context?: Record<string, any>;
  };
}

export interface MenuItem {
  name: string;
  price: string;
  description: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface Menu {
  categories: MenuCategory[];
}

export const loadLocalMenu = async (): Promise<Menu> => {
  try {
    const response = await fetch('/menu.json');
    if (!response.ok) {
      throw new Error('Failed to load menu');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading menu:', error);
    throw error;
  }
};

export const sendMessageToRasa = async (
  message: string, 
  senderId: string,
  context?: Record<string, any>
): Promise<RasaResponse[]> => {
  try {
    const response = await axios.post(RASA_ENDPOINT, {
      sender: senderId,
      message,
      metadata: {
        context,
        language: navigator.language,
        timestamp: new Date().toISOString()
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });

    // Ensure we have a valid response
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response from Rasa server');
    }

    // Add retry logic for failed requests
    let retries = 3;
    while (retries > 0 && (!response.data || response.data.length === 0)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      response = await axios.post(RASA_ENDPOINT, {
        sender: senderId,
        message
      });
      retries--;
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Rasa server is not running. Please start the Rasa server.');
      }
      if (error.response) {
        throw new Error(`Rasa server error: ${error.response.status} ${error.response.statusText}`);
      }
      if (error.request) {
        throw new Error('No response from Rasa server. Please check if it\'s running.');
      }
    }
    console.error('Rasa API error:', error);
    throw new Error('Failed to connect to Rasa server. Falling back to menu.');
  }
};

// Context management
let conversationContext: Record<string, any> = {};

export const updateContext = (newContext: Record<string, any>) => {
  conversationContext = { ...conversationContext, ...newContext };
};

export const getContext = () => conversationContext;

export const clearContext = () => {
  conversationContext = {};
};