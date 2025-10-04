import { PageOwner } from "./PageOwner";

export interface PageData {
  pageOwner: PageOwner;
  businessName: string;
  address: string;
  category: string;
  contactNumber: string;
  coverPhoto?: string | null;
  description: string;
  email: string;
  logo?: string | null;
  operatingHours: string;
  registrationNumber: string;
  website?: string;
}