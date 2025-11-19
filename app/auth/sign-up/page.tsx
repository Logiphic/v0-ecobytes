"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { ArrowLeft } from 'lucide-react';
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRY_CODES = [
  { code: "+971", country: "UAE", flag: "🇦🇪", pattern: /^5[0-9]{8}$/ },
  { code: "+1", country: "USA", flag: "🇺🇸", pattern: /^[2-9][0-9]{9}$/ },
  { code: "+44", country: "UK", flag: "🇬🇧", pattern: /^[1-9][0-9]{9,10}$/ },
  { code: "+91", country: "India", flag: "🇮🇳", pattern: /^[6-9][0-9]{9}$/ },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", pattern: /^5[0-9]{8}$/ },
  { code: "+20", country: "Egypt", flag: "🇪🇬", pattern: /^1[0-9]{9}$/ },
];

export default function SignUpPage() {
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"consumer" | "retailer" | "charity" | "farm">("consumer");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Za-z]/.test(pwd)) {
      return "Password must contain at least one letter";
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const validatePhoneNumber = (phone: string, code: string): boolean => {
    const country = COUNTRY_CODES.find(c => c.code === code);
    if (!country) return false;
    return country.pattern.test(phone);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (activeTab === "phone" && !validatePhoneNumber(phoneNumber, countryCode)) {
      setError("Invalid phone number for selected country");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    
    try {
      const { error } = await supabase.auth.signUp({
        email: activeTab === "email" ? email : `${phoneNumber}@phone.ecobytes.app`,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            role: role,
            phone: activeTab === "phone" ? `${countryCode}${phoneNumber}` : null,
          },
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-[3rem] bg-card p-8 shadow-2xl border-transparent border-none border-0 shadow-none">
          <Button
            variant="ghost"
            size="icon"
            className="mb-4"
            onClick={() => router.push("/auth/login")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="mb-6 flex flex-col items-center">
            <Image 
              src="/logo.png" 
              alt="EcoBytes Logo" 
              width={160} 
              height={53}
              className="mb-2 h-auto w-40"
            />
          </div>

          <h2 className="mb-4 text-center text-2xl font-bold">Register Account</h2>

          <div className="mb-6 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              className={`flex-1 rounded-full transition-colors ${
                activeTab === "email" 
                  ? "bg-lime-600 text-white hover:bg-lime-700" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("email")}
              size="sm"
            >
              Register Email
            </Button>
            <Button
              type="button"
              variant="secondary"
              className={`flex-1 rounded-full transition-colors ${
                activeTab === "phone" 
                  ? "bg-lime-600 text-white hover:bg-lime-700" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("phone")}
              size="sm"
            >
              Register Number
            </Button>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Name</Label>
              <Input
                type="text"
                placeholder=""
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-xl border-gray-200 bg-white"
              />
            </div>

            {activeTab === "email" ? (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Email</Label>
                <Input
                  type="email"
                  placeholder=""
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-gray-200 bg-white"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Phone Number</Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-32 rounded-xl border-gray-200 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      {COUNTRY_CODES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 rounded-xl border-gray-200 bg-white"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Password</Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-gray-200 bg-white"
              />
              <p className="text-xs text-muted-foreground text-lime-700">
                Min 8 characters, at least one letter and one number
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Confirm Password</Label>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl border-gray-200 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Select your role</Label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="role"
                    value="consumer"
                    checked={role === "consumer"}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="h-4 w-4 accent-primary"
                  />
                  Consumer
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="role"
                    value="retailer"
                    checked={role === "retailer"}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="h-4 w-4 accent-primary"
                  />
                  Retailer
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="role"
                    value="charity"
                    checked={role === "charity"}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="h-4 w-4 accent-primary"
                  />
                  Charity
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="role"
                    value="farm"
                    checked={role === "farm"}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="h-4 w-4 accent-primary"
                  />
                  Farm
                </label>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <Button
              type="submit"
              className="w-full rounded-full bg-lime-600 text-white hover:bg-lime-700"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? "Creating account..." : "Register"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-foreground hover:underline">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
