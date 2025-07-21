"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2 } from "lucide-react";
import type { AlternatifCardProps } from "@/types";

export function AlternatifCard({ alternatif, index, onEdit, onDelete, isEditing }: AlternatifCardProps) {
  return (
    <Card className={`transition-all ${isEditing ? "ring-2 ring-emerald-500 bg-emerald-50" : "hover:shadow-sm"}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>
              {isEditing && <Badge className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Editing</Badge>}
            </div>
            <h4 className="font-medium text-neutral-800 mb-1">{alternatif.nama}</h4>
            {alternatif.deskripsi && <p className="text-xs text-neutral-500">{alternatif.deskripsi}</p>}
          </div>
          <div className="flex gap-1 ml-2">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(alternatif)} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-1 h-8 w-8">
                <Edit2 className="w-3 h-3" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={() => onDelete(alternatif.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8">
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
