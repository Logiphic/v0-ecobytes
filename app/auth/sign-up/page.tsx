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

export default function SignUpPage() {
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"consumer" | "retailer" | "charity" | "farm">("consumer");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            role: role,
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
        <div className="rounded-[3rem] border-[6px] border-gray-900 bg-card p-8 shadow-2xl">
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
              variant={activeTab === "email" ? "default" : "secondary"}
              className="flex-1 rounded-full bg-primary text-white hover:bg-primary/90 data-[state=inactive]:bg-secondary data-[state=inactive]:text-foreground"
              onClick={() => setActiveTab("email")}
              size="sm"
            >
              Register Email
            </Button>
            <Button
              type="button"
              variant={activeTab === "phone" ? "default" : "secondary"}
              className="flex-1 rounded-full bg-primary text-white hover:bg-primary/90 data-[state=inactive]:bg-secondary data-[state=inactive]:text-foreground"
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

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {activeTab === "email" ? "Email" : "Phone Number"}
              </Label>
              <Input
                type={activeTab === "email" ? "email" : "tel"}
                placeholder=""
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-gray-200 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Password</Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-gray-200 bg-white"
              />
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

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              className="w-full rounded-full bg-primary text-white hover:bg-primary/90"
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
