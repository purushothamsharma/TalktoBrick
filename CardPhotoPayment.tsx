import React, { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { toast } from 'sonner';

interface CardPhotoPaymentProps {
  onCardData: (data: { number: string; expiry: string }) => void;
  onClose: () => void;
}

export function CardPhotoPayment({ onCardData, onClose }: CardPhotoPaymentProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera');
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      setIsProcessing(true);

      // Initialize Tesseract.js worker
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      // Recognize text from canvas
      const { data: { text } } = await worker.recognize(canvas);

      // Stop camera stream
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());

      // Extract card number and expiry
      const cardNumber = text.match(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/)?.[0];
      const expiry = text.match(/\b(0[1-9]|1[0-2])\/([0-9]{2})\b/)?.[0];

      if (!cardNumber || !expiry) {
        throw new Error('Could not detect card details');
      }

      // Clean up worker
      await worker.terminate();

      // Pass card data to parent
      onCardData({
        number: cardNumber.replace(/[\s-]/g, ''),
        expiry
      });

      setIsCapturing(false);
    } catch (error) {
      console.error('Error processing card:', error);
      toast.error('Could not read card details. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Card Photo Payment</h3>
          <button onClick={onClose} className="text-brick-950/60 hover:text-brick-950">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
          {isCapturing ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <Camera className="w-12 h-12" />
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex gap-4">
          {!isCapturing ? (
            <button
              onClick={startCamera}
              className="btn-primary flex-1"
            >
              Start Camera
            </button>
          ) : (
            <button
              onClick={capturePhoto}
              disabled={isProcessing}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Capture Card'}
            </button>
          )}
        </div>

        <p className="mt-4 text-sm text-brick-950/60 text-center">
          Position your card in the frame and ensure good lighting
        </p>
      </div>
    </div>
  );
}