"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-[3rem] bg-card p-8 shadow-2xl border-transparent border-0 shadow-none">
          <div className="mb-8 flex flex-col items-center">
            <Image 
              src="/logo.png" 
              alt="EcoBytes Logo" 
              width={180} 
              height={60}
              className="mb-2 h-auto w-44"
            />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email/Phone Number
              </label>
              <Input
                type="email"
                placeholder=""
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-gray-200 bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-gray-200 bg-white"
              />
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <Button 
              type="submit" 
              className="w-full rounded-full bg-#234223 border-gray-200 hover:bg-primary/90 bg-lime-600 text-white" 
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? "Signing in..." : "Login"}
            </Button>

            <div className="space-y-1 text-center text-sm">
              <Link href="#" className="block text-muted-foreground hover:underline">
                Forgot Password?
              </Link>
              <div className="text-muted-foreground">
                New to EcoBytes?{" "}
                <Link href="/auth/sign-up" className="font-semibold text-foreground hover:underline">
                  Register Account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
