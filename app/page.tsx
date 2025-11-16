import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Leaf, TrendingDown, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <h1 className="text-xl font-semibold">EcoBytes</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Track Your Food, Reduce Waste
            </h2>
            <p className="text-lg text-muted-foreground sm:text-xl">
              EcoBytes helps you manage your household food inventory, donate
              excess to those in need, and track your environmental impact
              through composting.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">Start Tracking Free</Link>
              </Button>
              <Button className="bg-lime-600 border-transparent text-white font-bold text-lg" size="lg" variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/50 py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Smart Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor expiration dates and get alerts before food goes bad.
                  Keep your kitchen organized and waste-free.
                </p>
              </div>

              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Easy Donations</h3>
                <p className="text-muted-foreground">
                  Connect with local organizations to donate excess food. Track
                  your contributions and make a difference.
                </p>
              </div>

              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <TrendingDown className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold">Compost Tracking</h3>
                <p className="text-muted-foreground">
                  Log composted items and see your environmental impact grow.
                  Every bit helps the planet.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 EcoBytes. Helping reduce food waste, one bite at a time.</p>
        </div>
      </footer>
    </div>
  );
}
