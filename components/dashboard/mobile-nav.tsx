"use client";

import { Package, Heart, Leaf, Award } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Package, label: 'Track', href: '/dashboard/track' },
    { icon: Heart, label: 'Donate', href: '/dashboard/donate' },
    { icon: Leaf, label: 'Compost', href: '/dashboard/compost' },
    { icon: Award, label: 'Rewards', href: '/dashboard/rewards' },
  ];

  return (
    <nav className="grid grid-cols-4 gap-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-2 touch-manipulation"
          >
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-all active:scale-95 ${
              isActive 
                ? 'border-[#7BAE7F] bg-[#7BAE7F] text-white shadow-md' 
                : 'border-gray-300 bg-white text-gray-700 hover:border-[#7BAE7F]'
            }`}>
              <Icon className="h-7 w-7" />
            </div>
            <span className={`text-sm font-medium ${isActive ? 'text-[#2F3A2F]' : 'text-gray-600'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
