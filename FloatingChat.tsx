import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBFFStore } from '../lib/store';
import { sendMessageToRasa } from '../lib/rasaProxy';
import { Message } from '../types';
import { toast } from 'sonner';

export function FloatingChat() {
  const { messages, addMessage, currentLanguage, isTyping, setTyping } = useBFFStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage
    };

    addMessage(userMessage);
    setInput('');
    setTyping(true);

    try {
      const sessionId = crypto.randomUUID();
      const context = {
        messages: messages.slice(-5).map(m => ({
          content: m.content,
          sender: m.sender,
          timestamp: m.timestamp
        }))
      };

      const responses = await sendMessageToRasa(input, sessionId, { context });

      for (const response of responses) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          content: response.text,
          sender: 'ai',
          timestamp: new Date(),
          language: currentLanguage,
          custom: response.custom
        };

        addMessage(aiMessage);
      }
    } catch (error) {
      console.error('Error in chat flow:', error);
      toast.error('Failed to process message');

      addMessage({
        id: crypto.randomUUID(),
        content: "I apologize, but I'm having trouble connecting right now. Could you please try again in a moment?",
        sender: 'ai',
        timestamp: new Date(),
        language: currentLanguage
      });
    } finally {
      setTyping(false);
      inputRef.current?.focus();
    }
  };

  return (
    <>
      {/* Bot button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-brick-500 text-white shadow-luxury hover:shadow-luxury-xl transition-all ${isOpen ? 'hidden' : ''}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bot className="w-6 h-6 md:w-7 md:h-7" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed md:bottom-6 md:right-6 md:w-96 w-full h-full md:h-auto inset-0 md:inset-auto bg-white rounded-none md:rounded-2xl shadow-luxury overflow-hidden border-0 md:border md:border-surface-200"
          >
            {/* Header */}
            <div className="p-4 bg-brick-500 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="w-6 h-6" />
                  <span className="font-medium">Brick Assistant</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[calc(100%-8rem)] md:h-96 overflow-y-auto p-4 space-y-4 bg-surface-50">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-xl ${
                      message.sender === 'user'
                        ? 'bg-brick-500 text-white'
                        : 'bg-white border border-surface-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/60' : 'text-brick-950/40'}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-brick-950/40">
                  <Bot className="w-5 h-5" />
                  <span className="text-sm">Typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-xl border border-surface-200 focus:border-brick-500 focus:ring-2 focus:ring-brick-500/20 outline-none"
                  disabled={isTyping}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={isTyping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-brick-500 text-white rounded-xl hover:bg-brick-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}