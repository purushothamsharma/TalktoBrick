import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chat } from '../../components/Chat';
import { useBFFStore } from '../../lib/store';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../lib/store', () => ({
  useBFFStore: vi.fn().mockImplementation(() => ({
    messages: [],
    addMessage: vi.fn(),
    currentLanguage: 'en',
    isTyping: false,
    setTyping: vi.fn(),
    currentOrder: { items: [], totalAmount: 0 },
    confirmOrder: vi.fn(),
    cancelOrder: vi.fn()
  }))
}));

describe('Chat Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderChat = () => {
    return render(
      <BrowserRouter>
        <Chat />
      </BrowserRouter>
    );
  };

  it('renders chat interface with BFF branding', () => {
    renderChat();
    expect(screen.getByText('BFF')).toBeInTheDocument();
    expect(screen.getByText('AI Food Assistant')).toBeInTheDocument();
  });

  it('handles food-related queries', async () => {
    const user = userEvent.setup();
    const mockAddMessage = vi.fn();
    const mockSetTyping = vi.fn();

    vi.mocked(useBFFStore).mockImplementation(() => ({
      messages: [],
      addMessage: mockAddMessage,
      currentLanguage: 'en',
      isTyping: false,
      setTyping: mockSetTyping,
      currentOrder: { items: [], totalAmount: 0 },
      confirmOrder: vi.fn(),
      cancelOrder: vi.fn()
    }));

    renderChat();

    const input = screen.getByPlaceholder(/ask about our menu/i);
    await user.type(input, 'Tell me about your steaks');
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockAddMessage).toHaveBeenCalled();
      expect(mockSetTyping).toHaveBeenCalledWith(true);
    });
  });

  it('handles dietary restriction queries', async () => {
    const user = userEvent.setup();
    const mockAddMessage = vi.fn();

    vi.mocked(useBFFStore).mockImplementation(() => ({
      messages: [],
      addMessage: mockAddMessage,
      currentLanguage: 'en',
      isTyping: false,
      setTyping: vi.fn(),
      currentOrder: { items: [], totalAmount: 0 },
      confirmOrder: vi.fn(),
      cancelOrder: vi.fn()
    }));

    renderChat();

    const input = screen.getByPlaceholder(/ask about our menu/i);
    await user.type(input, 'What are your vegetarian options?');
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockAddMessage).toHaveBeenCalled();
    });
  });
});