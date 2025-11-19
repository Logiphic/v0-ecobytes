"use client";

import { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [qrInput, setQrInput] = useState('');

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
          expiry_date: predictedExpiry,
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
      
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-3 border-b bg-[#7BAE7F] text-white">
          <h2 className="text-base font-semibold">QR Code Scanner</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-[#E3F0DB] border-[#7BAE7F]">
              <CheckCircle2 className="h-4 w-4 text-[#74B76A]" />
              <AlertDescription className="text-sm text-[#2F3A2F]">
                Food item added successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center gap-3 py-4">
            <Alert className="bg-[#FEF3CD] border-[#F4C542]">
              <AlertCircle className="h-4 w-4 text-[#C7A230]" />
              <AlertDescription className="text-xs text-[#4F5D4F]">
                QR code scanning is not available currently. Please use the manual food entry form.
              </AlertDescription>
            </Alert>
            <div className="p-4 bg-[#E3F0DB] rounded-full opacity-50">
              <Camera className="h-12 w-12 text-[#7BAE7F]" />
            </div>
            <p className="text-center text-[#4F5D4F] font-semibold text-base">
              QR Code Scanner Unavailable
            </p>
            <p className="text-center text-xs text-[#6E7D6E] px-2">
              Please use the "Add Food Item" button to manually enter your food items instead.
            </p>
          </div>

          <div className="space-y-3">
            <div className="border-t pt-3">
              <p className="text-xs font-medium text-[#4F5D4F] mb-2">Or enter QR data manually:</p>
              <textarea
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder='{"name": "Tomato", "category": "Vegetables", "expiry": "2025-11-20"}'
                className="w-full h-24 px-3 py-2 text-xs border border-[#C8D8C3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] resize-none bg-[#FFFFFF]"
                disabled={loading}
              />
              
              <div className="text-[10px] text-[#6E7D6E] space-y-1 bg-[#F7FBF5] p-2 rounded-lg mt-2">
                <p className="font-semibold text-[#4F5D4F]">Required: name, category, expiry (YYYY-MM-DD)</p>
                <p className="font-semibold text-[#4F5D4F]">Optional: sensor_data, authenticity, harvest_info</p>
              </div>

              <Button
                onClick={handleManualSubmit}
                disabled={loading || !qrInput.trim()}
                className="w-full mt-3 h-9 text-sm bg-[#7BAE7F] hover:bg-[#6AA86E] text-white"
              >
                {loading ? 'Adding...' : 'Add Item'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
