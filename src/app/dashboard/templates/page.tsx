"use client";

import { useState } from "react";
import { LayoutTemplate, Plus, Edit2, Trash2, CheckCircle2, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_CATEGORIES } from "@/lib/types";

interface LocalTemplate {
  id: string;
  name: string;
  isDefault: boolean;
  categories: Record<string, string[]>;
}

const initialTemplates: LocalTemplate[] = [
  {
    id: "tpl-1",
    name: "Standard Residential",
    isDefault: true,
    categories: DEFAULT_CATEGORIES,
  },
  {
    id: "tpl-2",
    name: "Condo / Townhouse",
    isDefault: false,
    categories: {
      Exterior: ["Roof (shared)", "Siding", "Foundation", "Balcony/Patio"],
      Interior: ["Walls/Ceilings", "Flooring", "Windows/Doors"],
      Kitchen: ["Countertops", "Cabinets", "Sink/Faucet", "Appliances"],
      Bathrooms: ["Toilet", "Tub/Shower", "Sink", "Ventilation"],
      Electrical: ["Service Panel", "Outlets", "Switches", "GFCI"],
      Plumbing: ["Water Heater", "Supply Lines", "Fixtures"],
      HVAC: ["AC", "Thermostat", "Ventilation"],
    },
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<LocalTemplate[]>(initialTemplates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const startEdit = (tpl: LocalTemplate) => {
    setEditingId(tpl.id);
    setEditName(tpl.name);
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return;
    setTemplates((prev) => prev.map((t) => (t.id === editingId ? { ...t, name: editName.trim() } : t)));
    setEditingId(null);
  };

  const duplicateTemplate = (tpl: LocalTemplate) => {
    const newTpl: LocalTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      name: `${tpl.name} (Copy)`,
      isDefault: false,
    };
    setTemplates((prev) => [...prev, newTpl]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const setDefault = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => ({ ...t, isDefault: t.id === id }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-500 mt-1">Manage your inspection checklist templates</p>
        </div>
        <Button onClick={() => {
          const newTpl: LocalTemplate = {
            id: `tpl-${Date.now()}`,
            name: "New Template",
            isDefault: false,
            categories: { ...DEFAULT_CATEGORIES },
          };
          setTemplates((prev) => [...prev, newTpl]);
          startEdit(newTpl);
        }}>
          <Plus className="w-4 h-4 mr-2" />New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tpl) => (
          <Card key={tpl.id} className={tpl.isDefault ? "border-blue-200 ring-1 ring-blue-100" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <LayoutTemplate className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    {editingId === tpl.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 text-sm"
                          onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                          autoFocus
                        />
                        <Button size="sm" onClick={saveEdit}>Save</Button>
                      </div>
                    ) : (
                      <CardTitle className="text-base">{tpl.name}</CardTitle>
                    )}
                    <CardDescription className="mt-0.5">
                      {Object.keys(tpl.categories).length} categories, {Object.values(tpl.categories).flat().length} items
                    </CardDescription>
                  </div>
                </div>
                {tpl.isDefault && <Badge variant="default">Default</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {Object.keys(tpl.categories).map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                ))}
              </div>
              <Separator className="mb-3" />
              <div className="flex items-center gap-2">
                {!tpl.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => setDefault(tpl.id)}>
                    <CheckCircle2 className="w-3 h-3 mr-1" />Set Default
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => startEdit(tpl)}>
                  <Edit2 className="w-3 h-3 mr-1" />Rename
                </Button>
                <Button variant="ghost" size="sm" onClick={() => duplicateTemplate(tpl)}>
                  <Copy className="w-3 h-3 mr-1" />Duplicate
                </Button>
                {!tpl.isDefault && (
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteTemplate(tpl.id)}>
                    <Trash2 className="w-3 h-3 mr-1" />Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
