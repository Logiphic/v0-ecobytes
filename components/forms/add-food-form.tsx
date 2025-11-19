"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { calculatePredictedExpiry, calculateStatus } from "@/lib/utils/expiry-prediction";
import { ArrowLeft } from 'lucide-react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";

const CATEGORIES = ["Dairy", "Fruit", "Vegetable", "Meat", "Poultry", "Other"];
const STORAGE_LOCATIONS = ["Refrigerator", "Freezer", "Pantry", "Counter"];

export function AddFoodForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    expiry_date: "",
    storage_location: "",
    origin: "",
    notes: "",
    temperature: "",
    humidity: "",
    ph: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in");
      setIsLoading(false);
      return;
    }

    const sensorData = {
      temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
      humidity: formData.humidity ? parseFloat(formData.humidity) : undefined,
      ph: formData.ph ? parseFloat(formData.ph) : undefined,
    };

    const cleanSensorData = Object.fromEntries(
      Object.entries(sensorData).filter(([_, v]) => v !== undefined)
    );

    const predictedExpiry = calculatePredictedExpiry(
      formData.expiry_date,
      Object.keys(cleanSensorData).length > 0 ? cleanSensorData : null
    );

    const status = calculateStatus(predictedExpiry);

    const { error: insertError } = await supabase.from("food_items").insert({
      user_id: user.id,
      name: formData.name,
      category: formData.category,
      declared_expiry_date: formData.expiry_date,
      predicted_expiry_date: predictedExpiry,
      expiry_date: predictedExpiry,
      storage_location: formData.storage_location || null,
      origin: formData.origin || null,
      notes: formData.notes || null,
      sensor_data: Object.keys(cleanSensorData).length > 0 ? cleanSensorData : null,
      status: status,
    });

    if (insertError) {
      setError(insertError.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard/track");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
          className="h-10 w-10 rounded-full hover:bg-[#ECF4E7]"
        >
          <Link href="/dashboard/track">
            <ArrowLeft className="h-5 w-5 text-[var(--text-primary)]" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Add Food Item</h1>
          <p className="text-sm text-[var(--text-secondary)]">Add a new item to your food list</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Food Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[var(--text-primary)] font-medium">
            Food Item Name *
          </Label>
          <Input
            id="name"
            placeholder="e.g., Fresh Apples"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-12 rounded-2xl border-[var(--input-border)] bg-white focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-[var(--text-primary)] font-medium">
            Category *
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            required
          >
            <SelectTrigger 
              id="category"
              className="h-12 rounded-2xl border-[var(--input-border)] bg-white"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[var(--input-border)] shadow-lg">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Expiry Date */}
        <div className="space-y-2">
          <Label htmlFor="expiry_date" className="text-[var(--text-primary)] font-medium">
            Expiry Date *
          </Label>
          <Input
            id="expiry_date"
            type="date"
            required
            value={formData.expiry_date}
            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
            className="h-12 rounded-2xl border-[var(--input-border)] bg-white focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
          />
          <p className="text-xs text-[var(--text-secondary)]">
            This will be adjusted based on storage conditions
          </p>
        </div>

        <div className="space-y-4 p-4 bg-[#F7FBF5] rounded-2xl">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Storage Conditions (Optional)
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Enter sensor data to predict more accurate expiry dates
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="temperature" className="text-xs text-[var(--text-secondary)]">
                Temp (°C)
              </Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="12.5"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                className="h-10 rounded-xl border-[var(--input-border)] bg-white text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="humidity" className="text-xs text-[var(--text-secondary)]">
                Humidity (%)
              </Label>
              <Input
                id="humidity"
                type="number"
                step="1"
                placeholder="75"
                value={formData.humidity}
                onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                className="h-10 rounded-xl border-[var(--input-border)] bg-white text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ph" className="text-xs text-[var(--text-secondary)]">
                pH Level
              </Label>
              <Input
                id="ph"
                type="number"
                step="0.1"
                placeholder="6.5"
                value={formData.ph}
                onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                className="h-10 rounded-xl border-[var(--input-border)] bg-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Origin (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="origin" className="text-[var(--text-secondary)] font-medium">
            Origin
          </Label>
          <Input
            id="origin"
            placeholder="e.g., Local Farm, USA, Organic Market"
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            className="h-12 rounded-2xl border-[var(--input-border)] bg-white focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
          />
        </div>

        {/* Storage Location (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="storage_location" className="text-[var(--text-secondary)] font-medium">
            Storage Location
          </Label>
          <Select
            value={formData.storage_location}
            onValueChange={(value) => setFormData({ ...formData, storage_location: value })}
          >
            <SelectTrigger 
              id="storage_location"
              className="h-12 rounded-2xl border-[var(--input-border)] bg-white"
            >
              <SelectValue placeholder="Select location (optional)" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[var(--input-border)] shadow-lg">
              {STORAGE_LOCATIONS.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-[var(--text-secondary)] font-medium">
            Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Add any additional notes..."
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="rounded-2xl border-[var(--input-border)] bg-white resize-none focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
          />
        </div>

        {error && (
          <p className="text-sm text-[var(--brand-error)] bg-red-50 p-3 rounded-xl">{error}</p>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="h-12 w-full rounded-2xl bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white text-base font-medium"
          >
            {isLoading ? "Adding..." : "Add Item"}
          </Button>
          <Button 
            type="button" 
            variant="ghost"
            asChild
            className="h-12 w-full text-[var(--text-secondary)] hover:bg-[#ECF4E7]"
          >
            <Link href="/dashboard/track">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
