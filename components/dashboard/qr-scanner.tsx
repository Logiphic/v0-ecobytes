"use client";

import { useState, useRef, useEffect } from "react";
import { X, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { calculatePredictedExpiry, calculateStatus } from "@/lib/utils/expiry-prediction";

interface QRData {
  name: string;
  category: string;
  expiry: string;
  harvest_info?: string;
  origin?: string;
  farm?: string;
  harvest_id?: string;
  sensor_data?: {
    ph?: number;
    temperature?: number;
    humidity?: number;
  };
  authenticity?: {
    brand?: string;
    manufacturer?: string;
    origin?: string;
    batch?: string;
    certification?: string;
    status?: string;
  };
  quantity?: number;
  unit?: string;
}

interface QrScannerProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function QrScanner({ onClose, onSuccess }: QrScannerProps) {
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraPermission('granted');
      setScanning(true);
    } catch (err) {
      console.error('[v0] Camera permission error:', err);
      setCameraPermission('denied');
      setError('Camera permission denied. Please enable camera access or use manual entry.');
    }
  };

  const validateQRData = (data: any): { valid: boolean; error?: string; data?: QRData } => {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Invalid QR code format' };
    }

    if (!data.name || typeof data.name !== 'string') {
      return { valid: false, error: 'Missing or invalid name field' };
    }

    if (!data.category || typeof data.category !== 'string') {
      return { valid: false, error: 'Missing or invalid category field' };
    }

    if (!data.expiry) {
      return { valid: false, error: 'Missing expiry date' };
    }

    const expiryDate = new Date(data.expiry);
    if (isNaN(expiryDate.getTime())) {
      return { valid: false, error: 'Invalid expiry date format' };
    }

    if (data.sensor_data && typeof data.sensor_data !== 'object') {
      return { valid: false, error: 'Invalid sensor data format' };
    }

    return { valid: true, data: data as QRData };
  };

  const processQRData = async (qrDataString: string) => {
    setError(null);
    setLoading(true);

    try {
      const parsedData = JSON.parse(qrDataString);
      console.log('[v0] Parsed QR data:', parsedData);

      const validation = validateQRData(parsedData);
      if (!validation.valid) {
        setError(validation.error || 'Invalid QR code data');
        setLoading(false);
        return;
      }

      const qrData = validation.data!;
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to add items');
        setLoading(false);
        return;
      }

      const predictedExpiry = calculatePredictedExpiry(qrData.expiry, qrData.sensor_data);
      const status = calculateStatus(predictedExpiry);

      const authenticityData = qrData.authenticity || {};

      const { error: insertError } = await supabase
        .from('food_items')
        .insert({
          user_id: user.id,
          name: qrData.name,
          category: qrData.category,
          quantity: qrData.quantity || 1,
          unit: qrData.unit || 'unit',
          declared_expiry_date: qrData.expiry,
          predicted_expiry_date: predictedExpiry,
          expiry_date: predictedExpiry, // Keep for backward compatibility
          status,
          harvest_info: qrData.harvest_info,
          origin: qrData.origin,
          farm: qrData.farm,
          harvest_id: qrData.harvest_id,
          sensor_data: qrData.sensor_data,
          authenticity_brand: authenticityData.brand,
          authenticity_manufacturer: authenticityData.manufacturer,
          authenticity_origin: authenticityData.origin,
          authenticity_batch: authenticityData.batch,
          authenticity_certification: authenticityData.certification,
          authenticity_status: authenticityData.status,
        });

      if (insertError) {
        console.error('[v0] Insert error:', insertError);
        setError(`Failed to add item: ${insertError.message}`);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      
      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (err: any) {
      console.error('[v0] Error processing QR code:', err);
      setError(err.message || 'Failed to process QR code. Please check the format.');
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (!qrInput.trim()) {
      setError('Please enter QR code data');
      return;
    }
    processQRData(qrInput);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border-2 border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-[#7BAE7F] text-white">
          <h2 className="text-lg font-semibold">Scan QR Code</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-[#E3F0DB] border-[#7BAE7F]">
              <CheckCircle2 className="h-4 w-4 text-[#74B76A]" />
              <AlertDescription className="text-[#2F3A2F]">
                Food item added successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Camera Permission Request */}
          {cameraPermission === 'pending' && !manualMode && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="p-6 bg-[#E3F0DB] rounded-full">
                <Camera className="h-16 w-16 text-[#7BAE7F]" />
              </div>
              <p className="text-center text-[#4F5D4F]">
                Camera access is required to scan QR codes
              </p>
              <Button 
                onClick={requestCameraPermission}
                className="w-full bg-[#7BAE7F] hover:bg-[#6AA86E] text-white"
              >
                Allow Camera Access
              </Button>
              <Button 
                onClick={() => setManualMode(true)}
                variant="outline"
                className="w-full border-[#7BAE7F] text-[#7BAE7F]"
              >
                Enter QR Data Manually
              </Button>
            </div>
          )}

          {/* Camera Permission Denied */}
          {cameraPermission === 'denied' && !manualMode && (
            <div className="flex flex-col items-center gap-4 py-8">
              <AlertCircle className="h-16 w-16 text-[#E26B5A]" />
              <p className="text-center text-[#4F5D4F]">
                Camera access was denied. Please enable it in your browser settings or use manual entry.
              </p>
              <Button 
                onClick={() => setManualMode(true)}
                className="w-full bg-[#7BAE7F] hover:bg-[#6AA86E] text-white"
              >
                Enter QR Data Manually
              </Button>
            </div>
          )}

          {/* Camera View (placeholder - actual QR scanning would need a library like html5-qrcode) */}
          {cameraPermission === 'granted' && scanning && !manualMode && (
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-900 rounded-xl overflow-hidden">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-4 border-[#7BAE7F] m-12 rounded-xl"></div>
              </div>
              <p className="text-center text-sm text-[#4F5D4F]">
                Position QR code within the frame
              </p>
              <Button 
                onClick={() => setManualMode(true)}
                variant="outline"
                className="w-full border-[#7BAE7F] text-[#7BAE7F]"
              >
                Switch to Manual Entry
              </Button>
            </div>
          )}

          {/* Manual Entry Mode */}
          {manualMode && (
            <div className="space-y-4">
              <textarea
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder='{"name": "Tomato", "category": "Vegetables", "expiry": "2025-11-20", "sensor_data": {"temperature": 12, "humidity": 75, "ph": 6.5}, "authenticity": {"brand": "FreshFarm", "status": "Verified"}}'
                className="w-full h-32 px-4 py-3 border border-[#C8D8C3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] resize-none bg-[#FFFFFF]"
                disabled={loading}
              />
              
              <div className="text-xs text-[#6E7D6E] space-y-1 bg-[#F7FBF5] p-3 rounded-lg">
                <p className="font-semibold text-[#4F5D4F]">Required: name, category, expiry (YYYY-MM-DD)</p>
                <p className="font-semibold text-[#4F5D4F]">Optional: sensor_data, authenticity, harvest_info, origin</p>
              </div>

              <div className="flex gap-2">
                {cameraPermission !== 'granted' && (
                  <Button
                    onClick={requestCameraPermission}
                    variant="outline"
                    className="flex-1 border-[#7BAE7F] text-[#7BAE7F]"
                  >
                    Use Camera
                  </Button>
                )}
                <Button
                  onClick={handleManualSubmit}
                  disabled={loading || !qrInput.trim()}
                  className="flex-1 bg-[#7BAE7F] hover:bg-[#6AA86E] text-white"
                >
                  {loading ? 'Adding...' : 'Add Item'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
