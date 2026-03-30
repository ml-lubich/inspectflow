export type Rating = "Good" | "Fair" | "Poor" | "Not Inspected";

export interface InspectionItem {
  id: string;
  category: string;
  itemName: string;
  rating: Rating;
  notes: string;
  photos: string[];
}

export interface PropertyDetails {
  address: string;
  propertyType: string;
  yearBuilt: string;
  sqft: string;
  bedrooms: string;
  bathrooms: string;
  clientName: string;
  clientEmail: string;
}

export interface Inspection {
  id: string;
  propertyDetails: PropertyDetails;
  items: InspectionItem[];
  status: "draft" | "in-progress" | "completed";
  createdAt: string;
  scheduledDate?: string;
  shareToken?: string;
}

export interface Template {
  id: string;
  name: string;
  isDefault: boolean;
  categories: Record<string, string[]>;
}

export interface Profile {
  companyName: string;
  companyLogoUrl?: string;
  phone: string;
  email: string;
  licenseNumber: string;
}

export const DEFAULT_CATEGORIES: Record<string, string[]> = {
  Exterior: ["Roof", "Siding", "Foundation", "Gutters", "Driveway", "Landscaping"],
  Interior: ["Walls/Ceilings", "Flooring", "Windows/Doors", "Stairs/Railings"],
  Kitchen: ["Countertops", "Cabinets", "Sink/Faucet", "Appliances", "Ventilation"],
  Bathrooms: ["Toilet", "Tub/Shower", "Sink", "Ventilation", "Tile/Grout"],
  Electrical: ["Service Panel", "Outlets", "Switches", "Wiring", "GFCI"],
  Plumbing: ["Water Heater", "Supply Lines", "Drain Lines", "Fixtures", "Water Pressure"],
  HVAC: ["Furnace/Boiler", "AC", "Ductwork", "Thermostat", "Ventilation"],
  Attic: ["Insulation", "Ventilation", "Structure", "Pests"],
  Garage: ["Door/Opener", "Floor", "Electrical", "Fire Separation"],
};
