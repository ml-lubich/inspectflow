"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  FileText,
  Calendar,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getInspections, getDashboardStats } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import type { Inspection } from "@/lib/types";

const statusVariant = (status: string) => {
  switch (status) {
    case "completed": return "good" as const;
    case "in-progress": return "fair" as const;
    default: return "secondary" as const;
  }
};

export default function DashboardPage() {
  const { profile } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, drafts: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [ins, st] = await Promise.all([getInspections(), getDashboardStats()]);
      setInspections(ins);
      setStats(st);
      setLoading(false);
    }
    load();
  }, []);

  const firstName = (profile?.fullName || "Inspector").split(" ")[0];

  const statCards = [
    { label: "Total Inspections", value: String(stats.total), icon: ClipboardCheck, trend: `${stats.completed} completed`, color: "bg-blue-100 text-blue-600" },
    { label: "Completed Reports", value: String(stats.completed), icon: FileText, trend: `${stats.drafts} drafts`, color: "bg-green-100 text-green-600" },
    { label: "In Progress", value: String(stats.inProgress), icon: Calendar, trend: `${stats.drafts} scheduled`, color: "bg-purple-100 text-purple-600" },
    { label: "Drafts", value: String(stats.drafts), icon: TrendingUp, trend: "Pending completion", color: "bg-orange-100 text-orange-600" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {firstName}. Here&apos;s your inspection overview.</p>
        </div>
        <Link href="/dashboard/inspections/new">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            New Inspection
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.trend}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/inspections/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <PlusCircle className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">New Inspection</p>
                <p className="text-xs text-gray-500">Start a new report</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/reports">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <FileText className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">View Reports</p>
                <p className="text-xs text-gray-500">Browse completed reports</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/templates">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <Calendar className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Manage Templates</p>
                <p className="text-xs text-gray-500">Customize checklists</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Inspections */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Inspections</CardTitle>
          <Link href="/dashboard/reports">
            <Button variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </Link>
        </CardHeader>
        <CardContent>
          {inspections.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No inspections yet</p>
              <p className="text-sm text-gray-400 mt-1">Create your first inspection to get started.</p>
              <Link href="/dashboard/inspections/new">
                <Button className="mt-4" size="sm">
                  <PlusCircle className="w-4 h-4 mr-2" />Create Inspection
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {inspections.slice(0, 5).map((inspection) => (
                <Link
                  key={inspection.id}
                  href={inspection.status === "completed" ? `/dashboard/reports/${inspection.id}` : "/dashboard/inspections/new"}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {inspection.propertyDetails.address}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500">{inspection.propertyDetails.clientName}</span>
                      <span className="text-xs text-gray-300">|</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {inspection.createdAt}
                      </span>
                    </div>
                  </div>
                  <Badge variant={statusVariant(inspection.status)}>
                    {inspection.status === "in-progress" ? "In Progress" : inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
