"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { Calendar, MoreVertical, Trash2, Gift, Leaf, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FoodItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  storage_location: string | null;
  notes: string | null;
  status: string;
}

interface FoodItemCardProps {
  item: FoodItem;
  status: "fresh" | "expiring" | "expired";
  onUpdate: () => void;
}

export function FoodItemCard({ item, status, onUpdate }: FoodItemCardProps) {
  const router = useRouter();

  const statusConfig = {
    fresh: { label: "Fresh", className: "bg-green-100 text-green-800 hover:bg-green-100" },
    expiring: { label: "Expiring Soon", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
    expired: { label: "Expired", className: "bg-red-100 text-red-800 hover:bg-red-100" },
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("food_items")
      .delete()
      .eq("id", item.id);

    if (!error) {
      onUpdate();
    }
  };

  const handleDonate = () => {
    router.push(`/dashboard/donate?itemId=${item.id}`);
  };

  const handleCompost = () => {
    router.push(`/dashboard/compost?itemId=${item.id}`);
  };

  const handleEdit = () => {
    router.push(`/dashboard/edit-item/${item.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <Card className="touch-manipulation">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{item.name}</CardTitle>
            <CardDescription className="text-sm truncate">{item.category}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleEdit} className="py-3">
                <Pencil className="mr-3 h-5 w-5" />
                <span className="text-base">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDonate} className="py-3">
                <Gift className="mr-3 h-5 w-5" />
                <span className="text-base">Donate</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCompost} className="py-3">
                <Leaf className="mr-3 h-5 w-5" />
                <span className="text-base">Compost</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="py-3 text-destructive">
                <Trash2 className="mr-3 h-5 w-5" />
                <span className="text-base">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between py-1">
          <span className="text-base text-muted-foreground">Quantity</span>
          <span className="text-base font-medium">{item.quantity} {item.unit}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-base text-muted-foreground">Expires</span>
          <span className="text-base font-medium">{formatDate(item.expiry_date)}</span>
        </div>
        {item.storage_location && (
          <div className="flex items-center justify-between py-1">
            <span className="text-base text-muted-foreground">Location</span>
            <span className="text-base font-medium truncate ml-2">{item.storage_location}</span>
          </div>
        )}
        <div className="pt-2">
          <Badge variant="secondary" className={`${statusConfig[status].className} px-3 py-1 text-sm font-medium`}>
            {statusConfig[status].label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
