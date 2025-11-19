import Link from "next/link";
import { HandHeart, ClipboardList, Calendar } from 'lucide-react';

export function CharityMobileNav() {
  const navItems = [
    { 
      label: "Requests", 
      icon: HandHeart, 
      href: "/charity/requests" 
    },
    { 
      label: "Needs", 
      icon: ClipboardList, 
      href: "/charity/needs" 
    },
    { 
      label: "Schedule", 
      icon: Calendar, 
      href: "/charity/schedule" 
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md active:scale-95"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <item.icon className="h-7 w-7 text-[var(--icon-primary)]" />
          </div>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
