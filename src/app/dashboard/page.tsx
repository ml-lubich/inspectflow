"use client";

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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockInspections } from "@/lib/mock-data";

const stats = [
  { label: "Total Inspections", value: "24", icon: ClipboardCheck, trend: "+3 this month", color: "bg-blue-100 text-blue-600" },
  { label: "Completed Reports", value: "18", icon: FileText, trend: "2 pending", color: "bg-green-100 text-green-600" },
  { label: "Scheduled", value: "4", icon: Calendar, trend: "Next: Apr 1", color: "bg-purple-100 text-purple-600" },
  { label: "This Month", value: "6", icon: TrendingUp, trend: "+50% vs last", color: "bg-orange-100 text-orange-600" },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "completed": return "good" as const;
    case "in-progress": return "fair" as const;
    default: return "secondary" as const;
  }
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Mike. Here&apos;s your inspection overview.</p>
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
        {stats.map((stat) => (
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
          <div className="space-y-3">
            {mockInspections.map((inspection) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
