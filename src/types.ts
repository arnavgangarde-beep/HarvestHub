import { LucideIcon } from "lucide-react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "seller" | "consumer";
  storeName?: string; // Only for sellers
  profileCompleted?: boolean;
  region?: string;
  username?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName?: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  category: string;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

// Keeping legacy types for now to avoid breaking imports immediately, 
// though they might be deprecated.
export interface Job {
  id: string;
  type: "pdf_worker" | "web_worker" | "social_worker";
  status: "queued" | "processing" | "completed" | "failed";
  fileName?: string;
  content?: string;
  result?: any;
  logs: string[];
  cost: number;
  createdAt: string;
}

export interface FarmerProfile {
  location: string;
  farmSize: number;
  farmSizeUnit: "acres" | "hectares";
  primaryCrops: string[];
}

export interface DashboardData {
  jobs: Job[];
  stats: {
    guidesProcessed: number;
    qaPairsGenerated: number;
    totalCost: number;
  };
}
