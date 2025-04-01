import React, { useState } from 'react';
import { Message } from '../types';
import { MenuCard } from './MenuCard';
import { CardPhotoPayment } from './CardPhotoPayment';
import { useBFFStore } from '../lib/store';
import { handleRasaAction, rasaActions } from '../lib/rasaActions';
import { Bot, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [showCardPhoto, setShowCardPhoto] = useState(false);
  const { currentOrder } = useBFFStore();
  const isAI = message.sender === 'ai';

  const handleCardData = async (cardData: { number: string; expiry: string }) => {
    try {
      const result = await handleRasaAction(rasaActions.PROCESS_PAYMENT, {
        orderId: currentOrder.id,
        amount: currentOrder.totalAmount * 100,
        cardData
      });

      if (result.success) {
        toast.success('Payment processed successfully!', {
          description: 'Your order has been confirmed'
        });
        setShowCardPhoto(false);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed', {
        description: 'Please try again or use a different payment method'
      });
    }
  };

  return (
    <>
      <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
        {isAI && (
          <div className="flex-shrink-0 mr-3">
            <Bot className="w-6 h-6 text-brick-500" />
          </div>
        )}
        <div
          className={`max-w-[70%] rounded-xl p-4 ${
            isAI
              ? 'bg-white text-brick-950 border border-surface-200 shadow-luxury'
              : 'bg-brick-500 text-white'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {message.menuItems && message.menuItems.length > 0 && (
            <div className="mt-4 space-y-4">
              {message.menuItems.map(item => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {message.custom?.action === 'request_payment' && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-surface-50 rounded-xl">
                <div className="text-sm font-medium text-brick-950">Order Summary</div>
                <div className="mt-2 font-bold text-brick-950">
                  Total: ${(message.custom.amount / 100).toFixed(2)}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCardPhoto(true)}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Pay with Card Photo
                </button>
                <button
                  onClick={() => useBFFStore.getState().cancelOrder()}
                  className="flex-1 btn-outline flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className={`text-xs mt-2 ${isAI ? 'text-brick-950/40' : 'text-white/60'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      {showCardPhoto && (
        <CardPhotoPayment
          onCardData={handleCardData}
          onClose={() => setShowCardPhoto(false)}
        />
      )}
    </>
  );
}