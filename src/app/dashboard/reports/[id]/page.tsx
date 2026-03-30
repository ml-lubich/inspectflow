"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Share2, MapPin, Home, Calendar, User, Mail, Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getInspection, getProfile } from "@/lib/database";
import { generateInspectionPDF } from "@/lib/pdf";
import type { Inspection, Profile } from "@/lib/types";

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [profile, setProfile] = useState<(Profile & { fullName: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [ins, prof] = await Promise.all([getInspection(id), getProfile()]);
      setInspection(ins);
      setProfile(prof);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 font-medium">Inspection not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/reports")}>
          Back to Reports
        </Button>
      </div>
    );
  }

  const p = inspection.propertyDetails;
  const deficiencies = inspection.items.filter((i) => i.rating === "Poor" || i.rating === "Fair");
  const categories = [...new Set(inspection.items.map((i) => i.category))];
  const companyName = profile?.companyName || "InspectFlow";

  const handleDownload = () => {
    const doc = generateInspectionPDF(inspection, {
      companyName,
      phone: profile?.phone || "",
      email: profile?.email || "",
      licenseNumber: profile?.licenseNumber || "",
    });
    doc.save(`Inspection-${p.address.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`);
  };

  const handleShare = () => {
    if (inspection.shareToken) {
      const url = `${window.location.origin}/report/${inspection.shareToken}`;
      navigator.clipboard.writeText(url);
      alert("Share link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/reports")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{p.address}</h1>
            <p className="text-sm text-gray-500">Inspection Report — {inspection.createdAt}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-1" />Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-1" />Share
          </Button>
          <Button size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" />Download PDF
          </Button>
        </div>
      </div>

      {/* Report Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Company Header */}
          <div className="text-center border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-bold text-gray-900">{companyName}</h2>
            {(profile?.phone || profile?.email) && (
              <p className="text-sm text-gray-500 mt-1">
                {[profile?.phone, profile?.email, profile?.licenseNumber ? `License: ${profile.licenseNumber}` : ""].filter(Boolean).join(" | ")}
              </p>
            )}
            <h3 className="text-lg font-semibold text-blue-600 mt-4">Home Inspection Report</h3>
          </div>

          {/* Property Details */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-600" /> Property Details
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-gray-400" /><span className="text-gray-500">Address:</span> <span className="font-medium">{p.address}</span></div>
              <div><span className="text-gray-500">Type:</span> <span className="font-medium">{p.propertyType}</span></div>
              <div><span className="text-gray-500">Year Built:</span> <span className="font-medium">{p.yearBuilt}</span></div>
              <div><span className="text-gray-500">Sq Ft:</span> <span className="font-medium">{p.sqft}</span></div>
              <div><span className="text-gray-500">Bedrooms:</span> <span className="font-medium">{p.bedrooms}</span></div>
              <div><span className="text-gray-500">Bathrooms:</span> <span className="font-medium">{p.bathrooms}</span></div>
            </div>
          </div>

          <Separator />

          {/* Client Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Client Information
            </h4>
            <div className="flex flex-wrap gap-6 text-sm">
              {p.clientName && <div className="flex items-center gap-2"><User className="w-3 h-3 text-gray-400" />{p.clientName}</div>}
              {p.clientEmail && <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-gray-400" />{p.clientEmail}</div>}
              <div className="flex items-center gap-2"><Calendar className="w-3 h-3 text-gray-400" />{inspection.createdAt}</div>
            </div>
          </div>

          <Separator />

          {/* Inspection Items by Category */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Inspection Findings</h4>
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500">No items inspected.</p>
            ) : (
              categories.map((cat) => {
                const catItems = inspection.items.filter((i) => i.category === cat);
                return (
                  <div key={cat} className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2 bg-gray-50 px-3 py-2 rounded-lg">{cat}</h5>
                    <div className="space-y-2 px-1">
                      {catItems.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 py-1.5">
                          <Badge
                            variant={item.rating === "Good" ? "good" : item.rating === "Fair" ? "fair" : item.rating === "Poor" ? "poor" : "secondary"}
                            className="w-20 justify-center text-xs shrink-0 mt-0.5"
                          >
                            {item.rating}
                          </Badge>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">{item.itemName}</span>
                            {item.notes && <p className="text-sm text-gray-500 mt-0.5">{item.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Deficiencies Summary */}
          {deficiencies.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold text-red-700 mb-3">Summary of Deficiencies ({deficiencies.length})</h4>
                <div className="bg-red-50 rounded-lg p-4 space-y-2">
                  {deficiencies.map((item, idx) => (
                    <div key={item.id} className="text-sm">
                      <span className="font-medium text-red-800">{idx + 1}. {item.category} — {item.itemName}</span>
                      <span className="text-red-600 ml-1">({item.rating})</span>
                      {item.notes && <span className="text-red-700">: {item.notes}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Signature Line */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex justify-between items-end">
              <div>
                <div className="w-48 border-b border-gray-400 mb-1" />
                <p className="text-sm text-gray-500">Inspector Signature</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Date: {inspection.createdAt}</p>
                <p>Report ID: {inspection.id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
