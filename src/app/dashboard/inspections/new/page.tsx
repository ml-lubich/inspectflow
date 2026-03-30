"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Camera,
  AlertTriangle,
  FileText,
  Home,
  ClipboardList,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DEFAULT_CATEGORIES, type Rating, type InspectionItem, type PropertyDetails } from "@/lib/types";

const steps = [
  { id: 1, label: "Property Details", icon: Home },
  { id: 2, label: "Inspection Checklist", icon: ClipboardList },
  { id: 3, label: "Summary", icon: ListChecks },
  { id: 4, label: "Review & Export", icon: FileText },
];

const ratingColors: Record<Rating, string> = {
  Good: "bg-green-100 text-green-800 border-green-200",
  Fair: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Poor: "bg-red-100 text-red-800 border-red-200",
  "Not Inspected": "bg-gray-100 text-gray-600 border-gray-200",
};

function buildInitialItems(): InspectionItem[] {
  let id = 0;
  const items: InspectionItem[] = [];
  for (const [category, itemNames] of Object.entries(DEFAULT_CATEGORIES)) {
    for (const itemName of itemNames) {
      items.push({ id: String(++id), category, itemName, rating: "Not Inspected", notes: "", photos: [] });
    }
  }
  return items;
}

export default function NewInspectionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeCategory, setActiveCategory] = useState("Exterior");
  const [property, setProperty] = useState<PropertyDetails>({
    address: "",
    propertyType: "Single Family",
    yearBuilt: "",
    sqft: "",
    bedrooms: "",
    bathrooms: "",
    clientName: "",
    clientEmail: "",
  });
  const [items, setItems] = useState<InspectionItem[]>(buildInitialItems);

  const updateItem = useCallback((id: string, field: keyof InspectionItem, value: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }, []);

  const deficiencies = items.filter((i) => i.rating === "Poor" || i.rating === "Fair");
  const inspectedCount = items.filter((i) => i.rating !== "Not Inspected").length;
  const categories = Object.keys(DEFAULT_CATEGORIES);

  const handleExport = () => {
    alert("PDF report generated! In production, this would download a PDF file.");
    router.push("/dashboard/reports");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Inspection</h1>
          <p className="text-sm text-gray-500">Complete each step to generate your report</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full",
                currentStep === step.id
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : currentStep > step.id
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-50 text-gray-400"
              )}
            >
              {currentStep > step.id ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              ) : (
                <step.icon className="w-4 h-4 shrink-0" />
              )}
              <span className="hidden sm:inline truncate">{step.label}</span>
              <span className="sm:hidden">{step.id}</span>
            </button>
            {idx < steps.length - 1 && (
              <div className={cn("h-px w-4 shrink-0", currentStep > step.id ? "bg-green-300" : "bg-gray-200")} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Property Details */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Property Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street, City, State ZIP"
                  value={property.address}
                  onChange={(e) => setProperty({ ...property, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select value={property.propertyType} onValueChange={(v) => setProperty({ ...property, propertyType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single Family">Single Family</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                    <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input id="yearBuilt" placeholder="2005" value={property.yearBuilt} onChange={(e) => setProperty({ ...property, yearBuilt: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sqft">Square Footage</Label>
                <Input id="sqft" placeholder="2,400" value={property.sqft} onChange={(e) => setProperty({ ...property, sqft: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input id="bedrooms" placeholder="4" value={property.bedrooms} onChange={(e) => setProperty({ ...property, bedrooms: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input id="bathrooms" placeholder="3" value={property.bathrooms} onChange={(e) => setProperty({ ...property, bathrooms: e.target.value })} />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input id="clientName" placeholder="John Smith" value={property.clientName} onChange={(e) => setProperty({ ...property, clientName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input id="clientEmail" type="email" placeholder="john@email.com" value={property.clientEmail} onChange={(e) => setProperty({ ...property, clientEmail: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Inspection Checklist */}
      {currentStep === 2 && (
        <div className="space-y-4">
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => {
              const catItems = items.filter((i) => i.category === cat);
              const done = catItems.filter((i) => i.rating !== "Not Inspected").length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                    activeCategory === cat ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  )}
                >
                  {cat}
                  {done > 0 && (
                    <span className={cn("ml-2 text-xs", activeCategory === cat ? "text-blue-200" : "text-gray-400")}>
                      {done}/{catItems.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Items for active category */}
          <div className="space-y-3">
            {items
              .filter((item) => item.category === activeCategory)
              .map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{item.itemName}</h4>
                          {item.rating !== "Not Inspected" && (
                            <CheckCircle2 className="w-4 h-4 text-green-500 sm:hidden" />
                          )}
                        </div>

                        {/* Rating buttons */}
                        <div className="flex flex-wrap gap-2">
                          {(["Good", "Fair", "Poor", "Not Inspected"] as Rating[]).map((rating) => (
                            <button
                              key={rating}
                              onClick={() => updateItem(item.id, "rating", rating)}
                              className={cn(
                                "px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
                                item.rating === rating
                                  ? ratingColors[rating] + " ring-2 ring-offset-1 ring-current"
                                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                              )}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>

                        {/* Notes */}
                        <Textarea
                          placeholder="Add notes..."
                          value={item.notes}
                          onChange={(e) => updateItem(item.id, "notes", e.target.value)}
                          className="min-h-[60px]"
                        />
                      </div>

                      {/* Photo upload placeholder */}
                      <div className="sm:w-32 shrink-0">
                        <button className="w-full h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors">
                          <Camera className="w-5 h-5 mb-1" />
                          <span className="text-xs">Add Photo</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Progress */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-medium text-gray-900">{inspectedCount}/{items.length} items</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${(inspectedCount / items.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Summary & Deficiencies */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Deficiencies & Issues ({deficiencies.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deficiencies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-3" />
                  <p className="font-medium text-gray-700">No deficiencies found</p>
                  <p className="text-sm mt-1">All inspected items are in good condition.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {deficiencies.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <Badge variant={item.rating === "Poor" ? "poor" : "fair"} className="mt-0.5 shrink-0">
                        {item.rating}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {item.category} — {item.itemName}
                        </p>
                        {item.notes && <p className="text-sm text-gray-600 mt-0.5">{item.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(["Good", "Fair", "Poor", "Not Inspected"] as Rating[]).map((rating) => {
              const count = items.filter((i) => i.rating === rating).length;
              return (
                <Card key={rating}>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <Badge variant={rating === "Good" ? "good" : rating === "Fair" ? "fair" : rating === "Poor" ? "poor" : "secondary"} className="mt-1">
                      {rating}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4: Review & Generate */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Property info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Property Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Address:</span> <span className="font-medium">{property.address || "—"}</span></div>
                  <div><span className="text-gray-500">Type:</span> <span className="font-medium">{property.propertyType}</span></div>
                  <div><span className="text-gray-500">Year Built:</span> <span className="font-medium">{property.yearBuilt || "—"}</span></div>
                  <div><span className="text-gray-500">Sq Ft:</span> <span className="font-medium">{property.sqft || "—"}</span></div>
                  <div><span className="text-gray-500">Bedrooms:</span> <span className="font-medium">{property.bedrooms || "—"}</span></div>
                  <div><span className="text-gray-500">Bathrooms:</span> <span className="font-medium">{property.bathrooms || "—"}</span></div>
                  <div><span className="text-gray-500">Client:</span> <span className="font-medium">{property.clientName || "—"}</span></div>
                  <div><span className="text-gray-500">Email:</span> <span className="font-medium">{property.clientEmail || "—"}</span></div>
                </div>
              </div>

              <Separator />

              {/* Inspection summary by category */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Inspection Summary</h4>
                {categories.map((cat) => {
                  const catItems = items.filter((i) => i.category === cat);
                  const inspected = catItems.filter((i) => i.rating !== "Not Inspected");
                  if (inspected.length === 0) return null;
                  return (
                    <div key={cat} className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">{cat}</h5>
                      <div className="space-y-1">
                        {inspected.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 text-sm">
                            <Badge
                              variant={item.rating === "Good" ? "good" : item.rating === "Fair" ? "fair" : "poor"}
                              className="text-xs w-16 justify-center"
                            >
                              {item.rating}
                            </Badge>
                            <span className="text-gray-700">{item.itemName}</span>
                            {item.notes && <span className="text-gray-400 truncate">— {item.notes}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {deficiencies.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">
                      Deficiencies ({deficiencies.length})
                    </h4>
                    <div className="space-y-1">
                      {deficiencies.map((item) => (
                        <div key={item.id} className="text-sm text-gray-700">
                          <span className="font-medium">{item.category} — {item.itemName}:</span>{" "}
                          {item.notes || "No notes"}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button size="lg" onClick={handleExport} className="px-8">
              <FileText className="w-5 h-5 mr-2" />
              Generate PDF Report
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        {currentStep < 4 && (
          <Button onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
