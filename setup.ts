import '@testing-library/jest-dom';
import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock OpenAI
vi.mock('openai', () => ({
  OpenAI: class {
    constructor() {
      return {
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [{
                message: {
                  content: "Here are our popular dishes: Idly ($7.99), Masala Dosa ($13.99)"
                }
              }]
            })
          }
        }
      };
    }
  }
}));

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ 
        data: { 
          user: { 
            id: 'test-user',
            email: 'test@example.com',
            user_metadata: {
              name: 'Test User',
              role: 'user'
            }
          } 
        },
        error: null
      }),
      signInWithPassword: vi.fn().mockResolvedValue({ 
        data: { 
          user: { 
            id: 'test-user',
            email: 'test@example.com'
          } 
        },
        error: null
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ 
        data: { 
          subscription: { 
            unsubscribe: vi.fn() 
          } 
        } 
      })
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ 
        data: { 
          id: 'test-id',
          content: 'Test message',
          created_at: new Date().toISOString()
        },
        error: null
      })
    }),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue({ 
        unsubscribe: vi.fn(),
        error: null 
      })
    }),
    removeChannel: vi.fn()
  })
}));

// MSW handlers for network requests
const handlers = [
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({ 
      access_token: 'mock-token',
      user: { id: 'mock-user-id' }
    });
  }),
  
  http.get('*/rest/v1/messages', () => {
    return HttpResponse.json([]);
  }),
  
  http.post('*/rest/v1/messages', () => {
    return HttpResponse.json({ id: 'mock-message-id' });
  }),
];

const server = setupServer(...handlers);

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

// Mock window.crypto for UUID generation
Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid',
    getRandomValues: () => new Uint8Array(32),
  },
});

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;