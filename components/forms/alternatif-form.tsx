"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2 } from "lucide-react";
import type { AlternatifFormProps } from "@/types";

export function AlternatifForm({ onSubmit, editData, onCancel, loading = false }: AlternatifFormProps) {
  const [formData, setFormData] = useState({ nama: editData?.nama || "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nama.trim()) {
      onSubmit({ nama: formData.nama.trim() });
      if (!editData) {
        setFormData({ nama: "" });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-neutral-700">{editData ? "Edit Alternatif" : "Tambah Alternatif Baru"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nama" className="text-sm font-medium text-neutral-600">
              Nama Bahan Kain
            </Label>
            <Input id="nama" type="text" value={formData.nama} onChange={(e) => setFormData({ nama: e.target.value })} placeholder="Contoh: Katun, Polyester, Sutra, Linen" className="mt-1" required />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className={`flex-1 ${editData ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editData ? "Mengupdate..." : "Menyimpan..."}
                </>
              ) : editData ? (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Update Alternatif
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Alternatif
                </>
              )}
            </Button>
            {editData && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="px-4 bg-transparent">
                Batal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
