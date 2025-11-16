"use client";

import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

interface FoodDetailCardProps {
  item: FoodItem;
  onClose: () => void;
}

export function FoodDetailCard({ item, onClose }: FoodDetailCardProps) {
  const router = useRouter();
  const [showAuthenticity, setShowAuthenticity] = useState(false);
  const [showHarvest, setShowHarvest] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  };

  const getStatus = (expiryDate: string): { label: string; color: string; type: "fresh" | "near-expiry" | "expired" } => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return { label: "Expired", color: "bg-[var(--status-expired)]", type: "expired" };
    if (daysUntilExpiry <= 3) return { label: "Near Expiry", color: "bg-[var(--status-near-expiry)]", type: "near-expiry" };
    return { label: "Fresh", color: "bg-[var(--status-fresh)]", type: "fresh" };
  };

  const status = getStatus(item.expiry_date);

  // Parse authenticity and harvest info if stored as JSON strings
  let authenticityData: any = null;
  let harvestData: any = null;

  try {
    if (item.authenticity && typeof item.authenticity === 'string') {
      authenticityData = JSON.parse(item.authenticity);
    } else if (item.authenticity && typeof item.authenticity === 'object') {
      authenticityData = item.authenticity;
    }
  } catch (e) {
    authenticityData = { info: item.authenticity };
  }

  try {
    if (item.harvest_info && typeof item.harvest_info === 'string') {
      harvestData = JSON.parse(item.harvest_info);
    } else if (item.harvest_info && typeof item.harvest_info === 'object') {
      harvestData = item.harvest_info;
    }
  } catch (e) {
    harvestData = { info: item.harvest_info };
  }

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-overlay)] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--brand-primary)] text-white px-6 py-4 rounded-t-3xl flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold">Food Details</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-3">
          <div className="bg-[var(--bg-card)] rounded-2xl p-4 space-y-3">
            <DetailRow label="Origin" value={item.origin || "Local"} />
            <DetailRow label="Food Name" value={item.name} />
            <DetailRow label="Category" value={item.category} />
            <DetailRow label="Expiry Date" value={formatDate(item.expiry_date)} />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Expiry Status</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-primary)]">{status.label}</span>
                <div className={`w-3 h-3 rounded-full ${status.color}`} />
              </div>
            </div>

            <DetailRow label="Storage Location" value={item.storage_location || "Cold Storage"} />
            <DetailRow label="Notes" value={item.notes || "No additional notes"} />
          </div>

          {(authenticityData || item.authenticity) && (
            <div className="bg-[var(--bg-card)] rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowAuthenticity(!showAuthenticity)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-[var(--bg-light)] transition-colors"
              >
                <span className="font-semibold text-[var(--text-primary)]">Authenticity Information</span>
                {showAuthenticity ? (
                  <ChevronDown className="h-5 w-5 text-[var(--icon-primary)]" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-[var(--icon-primary)]" />
                )}
              </button>
              
              {showAuthenticity && (
                <div className="px-4 pb-4 space-y-3 border-t border-[var(--input-border)]">
                  {authenticityData && typeof authenticityData === 'object' ? (
                    <>
                      {authenticityData.organic !== undefined && (
                        <DetailRow label="Type" value={authenticityData.organic ? "Organic" : "Non-organic"} />
                      )}
                      {authenticityData.certification && (
                        <DetailRow label="Certification" value={authenticityData.certification} />
                      )}
                      {authenticityData.supplier && (
                        <DetailRow label="Supplier" value={authenticityData.supplier} />
                      )}
                      {authenticityData.quality_grade && (
                        <DetailRow label="Quality Grade" value={authenticityData.quality_grade} />
                      )}
                    </>
                  ) : (
                    <DetailRow label="Info" value={item.authenticity || "Verified authentic"} />
                  )}
                </div>
              )}
            </div>
          )}

          <div className="bg-[var(--bg-card)] rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowHarvest(!showHarvest)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-[var(--bg-light)] transition-colors"
            >
              <span className="font-semibold text-[var(--text-primary)]">Harvest Information</span>
              {showHarvest ? (
                <ChevronDown className="h-5 w-5 text-[var(--icon-primary)]" />
              ) : (
                <ChevronRight className="h-5 w-5 text-[var(--icon-primary)]" />
              )}
            </button>
            
            {showHarvest && (
              <div className="px-4 pb-4 space-y-3 border-t border-[var(--input-border)]">
                <DetailRow label="Harvest ID" value={item.harvest_id || "N/A"} />
                <DetailRow label="Crop Name" value={item.name} />
                <DetailRow label="Harvest Quantity" value={`${item.quantity} ${item.unit}`} />
                
                {harvestData && typeof harvestData === 'object' ? (
                  <>
                    {harvestData.harvest_date && (
                      <DetailRow label="Harvest Date" value={formatDate(harvestData.harvest_date)} />
                    )}
                    {harvestData.quality_status && (
                      <DetailRow label="Quality Status" value={harvestData.quality_status} />
                    )}
                    {harvestData.storage_conditions && (
                      <DetailRow label="Storage Conditions" value={harvestData.storage_conditions} />
                    )}
                    {harvestData.notes && (
                      <DetailRow label="Additional Notes" value={harvestData.notes} />
                    )}
                  </>
                ) : item.harvest_info ? (
                  <DetailRow label="Info" value={item.harvest_info} />
                ) : null}

                {item.farm && <DetailRow label="Farm" value={item.farm} />}

                {/* Sensor Data */}
                {item.sensor_data && (
                  <div className="pt-2 border-t border-[var(--input-border)] space-y-2">
                    <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Sensor Data</p>
                    {item.sensor_data.ph && <DetailRow label="pH Level" value={item.sensor_data.ph} />}
                    {item.sensor_data.temperature && <DetailRow label="Temperature" value={`${item.sensor_data.temperature}°C`} />}
                    {item.sensor_data.humidity && <DetailRow label="Humidity" value={`${item.sensor_data.humidity}%`} />}
                  </div>
                )}
              </div>
            )}
          </div>

          {status.type === "expired" && (
            <Button
              onClick={() => router.push(`/dashboard/compost?itemId=${item.id}`)}
              className="w-full bg-[var(--brand-accent-orange)] hover:bg-[var(--brand-accent-orange)]/90 text-white h-12 rounded-2xl font-semibold bg-[rgba(217,83,79,1)]"
            >
              Send to Compost
            </Button>
          )}
          
          {status.type === "near-expiry" && (
            <Button
              onClick={() => router.push(`/dashboard/donate?itemId=${item.id}`)}
              className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white h-12 rounded-2xl font-semibold bg-[rgba(239,184,92,1)]"
            >
              Donate Item
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
      <span className="text-sm text-[var(--text-primary)] text-right flex-1">{value}</span>
    </div>
  );
}
