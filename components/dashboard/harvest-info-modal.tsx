"use client";

import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface FoodItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  harvest_id: string | null;
  harvest_info: string | null;
  authenticity: string | null;
  origin: string | null;
  farm: string | null;
  sensor_data: any;
  storage_location: string | null;
  notes: string | null;
}

interface HarvestInfoModalProps {
  item: FoodItem;
  onClose: () => void;
}

export function HarvestInfoModal({ item, onClose }: HarvestInfoModalProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  };

  const getStatus = (expiryDate: string): "fresh" | "near-expiry" | "expired" => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 3) return "near-expiry";
    return "fresh";
  };

  const status = getStatus(item.expiry_date);

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-overlay)] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-[var(--brand-primary)] text-white px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <h2 className="text-lg font-semibold">Harvest Information</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {/* Basic Info */}
          <div className="space-y-2">
            <InfoRow label="Harvest ID:" value={item.harvest_id || "N/A"} />
            <InfoRow label="Crop Name:" value={item.name} />
            <InfoRow label="Quantity Harvested:" value={`${item.quantity} ${item.unit}`} />
          </div>

          <div className="border-t border-[var(--input-border)] pt-4 space-y-2">
            <InfoRow label="Harvest Date:" value={item.harvest_info || formatDate(item.expiry_date)} />
            <InfoRow label="Expiry Date:" value={formatDate(item.expiry_date)} />
            <InfoRow label="Quality Status:" value={status === "fresh" ? "Good" : status === "near-expiry" ? "Fair" : "Poor"} />
          </div>

          <div className="border-t border-[var(--input-border)] pt-4 space-y-2">
            <InfoRow label="Storage Location:" value={item.storage_location || "Cold Storage"} />
            <InfoRow label="Notes:" value={item.notes || "Freshly harvested, keep refrigerated"} />
          </div>

          {/* Authenticity Info */}
          {item.authenticity && (
            <div className="border-t border-[var(--input-border)] pt-4">
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">Authenticity</h3>
              <p className="text-sm text-[var(--text-secondary)]">{item.authenticity}</p>
            </div>
          )}

          {/* Origin & Farm */}
          {(item.origin || item.farm) && (
            <div className="border-t border-[var(--input-border)] pt-4 space-y-2">
              {item.origin && <InfoRow label="Origin:" value={item.origin} />}
              {item.farm && <InfoRow label="Farm:" value={item.farm} />}
            </div>
          )}

          {/* Sensor Data */}
          {item.sensor_data && (
            <div className="border-t border-[var(--input-border)] pt-4">
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">Sensor Data</h3>
              <div className="space-y-2">
                {item.sensor_data.ph && <InfoRow label="pH:" value={item.sensor_data.ph} />}
                {item.sensor_data.temperature && <InfoRow label="Temperature:" value={`${item.sensor_data.temperature}°C`} />}
                {item.sensor_data.humidity && <InfoRow label="Humidity:" value={`${item.sensor_data.humidity}%`} />}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t border-[var(--input-border)] pt-4 space-y-2">
            {status === "expired" && (
              <Button
                onClick={() => router.push(`/dashboard/compost?itemId=${item.id}`)}
                className="w-full bg-[var(--brand-accent-orange)] hover:bg-[var(--brand-accent-orange)]/90 text-white"
              >
                Send to Compost
              </Button>
            )}
            {status === "near-expiry" && (
              <Button
                onClick={() => router.push(`/dashboard/donate?itemId=${item.id}`)}
                className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white"
              >
                Donate Item
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
      <span className="text-sm text-[var(--text-primary)] text-right">{value}</span>
    </div>
  );
}
