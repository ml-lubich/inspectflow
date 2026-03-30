"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Search, MapPin, Clock, Download, Share2, Eye, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getInspections, getProfile } from "@/lib/database";
import { generateInspectionPDF } from "@/lib/pdf";
import type { Inspection } from "@/lib/types";

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getInspections();
      setInspections(data);
      setLoading(false);
    }
    load();
  }, []);

  const completed = inspections.filter(
    (i) =>
      i.status === "completed" &&
      (i.propertyDetails.address.toLowerCase().includes(search.toLowerCase()) ||
        i.propertyDetails.clientName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDownload = async (inspection: Inspection) => {
    const profile = await getProfile();
    const doc = generateInspectionPDF(inspection, {
      companyName: profile?.companyName || "InspectFlow",
      phone: profile?.phone || "",
      email: profile?.email || "",
      licenseNumber: profile?.licenseNumber || "",
    });
    doc.save(`Inspection-${inspection.propertyDetails.address.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`);
  };

  const handleShare = (inspection: Inspection) => {
    if (inspection.shareToken) {
      const url = `${window.location.origin}/report/${inspection.shareToken}`;
      navigator.clipboard.writeText(url);
      alert("Share link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">View and manage completed inspection reports</p>
        </div>
        <Link href="/dashboard/inspections/new">
          <Button><FileText className="w-4 h-4 mr-2" />New Report</Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by address or client name..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {completed.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No reports found</p>
            <p className="text-sm text-gray-400 mt-1">Completed inspections will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completed.map((inspection) => (
            <Card key={inspection.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{inspection.propertyDetails.address}</CardTitle>
                      <p className="text-sm text-gray-500 mt-0.5">{inspection.propertyDetails.clientName}</p>
                    </div>
                  </div>
                  <Badge variant="good">Completed</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{inspection.createdAt}</span>
                  <span>{inspection.propertyDetails.propertyType}</span>
                  {inspection.propertyDetails.sqft && <span>{inspection.propertyDetails.sqft} sq ft</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/reports/${inspection.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full"><Eye className="w-3 h-3 mr-1" />View</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(inspection)}>
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleShare(inspection)}>
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
