"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { KriteriaFormProps } from "@/types";

export function KriteriaForm({ onSubmit, editData, onCancel, loading = false }: KriteriaFormProps) {
  const [formData, setFormData] = useState({
    nama: editData?.nama || "",
    bobot: editData?.bobot.toString() || "",
    atribut: editData?.atribut || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nama && formData.bobot && formData.atribut) {
      onSubmit({
        nama: formData.nama,
        bobot: Number.parseInt(formData.bobot),
        atribut: formData.atribut as "Benefit" | "Cost",
      });
      if (!editData) {
        setFormData({ nama: "", bobot: "", atribut: "" });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-neutral-700">{editData ? "Edit Kriteria" : "Tambah Kriteria Baru"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nama" className="text-sm font-medium text-neutral-600">
              Nama Kriteria
            </Label>
            <Input id="nama" type="text" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} placeholder="Contoh: Kekuatan, Harga, Kenyamanan" className="mt-1" required />
          </div>

          <div>
            <Label htmlFor="bobot" className="text-sm font-medium text-neutral-600">
              Bobot Kriteria
            </Label>
            <Select value={formData.bobot} onValueChange={(value) => setFormData({ ...formData, bobot: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Pilih bobot (1-5)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Sangat Rendah</SelectItem>
                <SelectItem value="2">2 - Rendah</SelectItem>
                <SelectItem value="3">3 - Sedang</SelectItem>
                <SelectItem value="4">4 - Tinggi</SelectItem>
                <SelectItem value="5">5 - Sangat Tinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="atribut" className="text-sm font-medium text-neutral-600">
              Atribut
            </Label>
            <Select value={formData.atribut} onValueChange={(value) => setFormData({ ...formData, atribut: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Pilih atribut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Benefit">Benefit (Semakin tinggi semakin baik)</SelectItem>
                <SelectItem value="Cost">Cost (Semakin rendah semakin baik)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editData ? "Mengupdate..." : "Menyimpan..."}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {editData ? "Update Kriteria" : "Tambah Kriteria"}
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
