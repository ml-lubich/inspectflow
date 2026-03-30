import { supabase } from "./supabase";
import type { Inspection, InspectionItem, Profile, Rating } from "./types";

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signUp(email: string, password: string, fullName: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

// ─── Profile ────────────────────────────────────────────────────────────────

export async function getProfile(): Promise<Profile & { fullName: string } | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (!data) return null;
  return {
    companyName: data.company_name || "",
    companyLogoUrl: data.company_logo_url || undefined,
    phone: data.phone || "",
    email: data.email || "",
    licenseNumber: data.license_number || "",
    fullName: data.full_name || "",
  };
}

export async function updateProfile(profile: Partial<Profile & { fullName: string }>) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("profiles")
    .update({
      company_name: profile.companyName,
      phone: profile.phone,
      email: profile.email,
      license_number: profile.licenseNumber,
      full_name: profile.fullName,
    })
    .eq("user_id", user.id);
  if (error) throw error;
}

// ─── Inspections ────────────────────────────────────────────────────────────

interface DbInspection {
  id: string;
  user_id: string;
  property_address: string;
  property_type: string;
  year_built: string;
  sq_ft: string;
  bedrooms: string;
  bathrooms: string;
  client_name: string;
  client_email: string;
  status: string;
  created_at: string;
  scheduled_date: string | null;
  share_token: string | null;
}

interface DbItem {
  id: string;
  inspection_id: string;
  category: string;
  item_name: string;
  rating: string;
  notes: string;
  sort_order: number;
}

function mapInspection(row: DbInspection, items: DbItem[] = []): Inspection {
  return {
    id: row.id,
    propertyDetails: {
      address: row.property_address,
      propertyType: row.property_type,
      yearBuilt: row.year_built,
      sqft: row.sq_ft,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      clientName: row.client_name,
      clientEmail: row.client_email,
    },
    items: items
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => ({
        id: i.id,
        category: i.category,
        itemName: i.item_name,
        rating: i.rating as Rating,
        notes: i.notes,
        photos: [],
      })),
    status: row.status as Inspection["status"],
    createdAt: new Date(row.created_at).toISOString().split("T")[0],
    scheduledDate: row.scheduled_date
      ? new Date(row.scheduled_date).toISOString().split("T")[0]
      : undefined,
    shareToken: row.share_token || undefined,
  };
}

export async function getInspections(): Promise<Inspection[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const { data: rows } = await supabase
    .from("inspections")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (!rows) return [];

  const ids = rows.map((r: DbInspection) => r.id);
  const { data: allItems } = await supabase
    .from("inspection_items")
    .select("*")
    .in("inspection_id", ids)
    .order("sort_order");

  return rows.map((row: DbInspection) => {
    const items = (allItems || []).filter((i: DbItem) => i.inspection_id === row.id);
    return mapInspection(row, items);
  });
}

export async function getInspection(id: string): Promise<Inspection | null> {
  const { data: row } = await supabase
    .from("inspections")
    .select("*")
    .eq("id", id)
    .single();
  if (!row) return null;

  const { data: items } = await supabase
    .from("inspection_items")
    .select("*")
    .eq("inspection_id", id)
    .order("sort_order");

  return mapInspection(row, items || []);
}

export async function getInspectionByShareToken(token: string): Promise<Inspection | null> {
  const { data: row } = await supabase
    .from("inspections")
    .select("*")
    .eq("share_token", token)
    .eq("status", "completed")
    .single();
  if (!row) return null;

  const { data: items } = await supabase
    .from("inspection_items")
    .select("*")
    .eq("inspection_id", row.id)
    .order("sort_order");

  return mapInspection(row, items || []);
}

export async function createInspection(
  property: Inspection["propertyDetails"],
  items: InspectionItem[],
  status: Inspection["status"] = "completed"
): Promise<Inspection | null> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const { data: inspection, error } = await supabase
    .from("inspections")
    .insert({
      user_id: user.id,
      property_address: property.address,
      property_type: property.propertyType,
      year_built: property.yearBuilt,
      sq_ft: property.sqft,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      client_name: property.clientName,
      client_email: property.clientEmail,
      status,
    })
    .select()
    .single();

  if (error || !inspection) throw error || new Error("Failed to create inspection");

  if (items.length > 0) {
    const inspectionItems = items
      .filter((i) => i.rating !== "Not Inspected")
      .map((item, idx) => ({
        inspection_id: inspection.id,
        category: item.category,
        item_name: item.itemName,
        rating: item.rating,
        notes: item.notes,
        sort_order: idx,
      }));

    if (inspectionItems.length > 0) {
      const { error: itemsError } = await supabase
        .from("inspection_items")
        .insert(inspectionItems);
      if (itemsError) throw itemsError;
    }
  }

  return getInspection(inspection.id);
}

export async function updateInspectionStatus(id: string, status: Inspection["status"]) {
  const { error } = await supabase
    .from("inspections")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteInspection(id: string) {
  const { error } = await supabase
    .from("inspections")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ─── Stats ──────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const user = await getCurrentUser();
  if (!user) return { total: 0, completed: 0, drafts: 0, inProgress: 0 };

  const { data: all } = await supabase
    .from("inspections")
    .select("status")
    .eq("user_id", user.id);

  const rows = all || [];
  return {
    total: rows.length,
    completed: rows.filter((r: { status: string }) => r.status === "completed").length,
    drafts: rows.filter((r: { status: string }) => r.status === "draft").length,
    inProgress: rows.filter((r: { status: string }) => r.status === "in-progress").length,
  };
}
