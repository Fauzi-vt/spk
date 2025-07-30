"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface LocalPenilaianData {
  [alternatifId: string]: {
    [kriteriaId: string]: number;
  };
}

interface LocalPenilaianTableProps {
  kriteria: Array<{
    id: string;
    nama: string;
    atribut: "Benefit" | "Cost";
  }>;
  alternatif: Array<{
    id: string;
    nama: string;
  }>;
  penilaian: LocalPenilaianData;
  onValueChange: (alternatifId: string, kriteriaId: string, value: string) => void;
}

export function PenilaianTable({ kriteria, alternatif, penilaian, onValueChange }: LocalPenilaianTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-semibold text-neutral-700">Matriks Penilaian</CardTitle>
        <div className="flex items-start gap-2 text-sm text-neutral-600">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Nilai berkisar antara 0-100. Semakin tinggi nilai, semakin baik untuk kriteria Benefit.</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile Card View */}
        <div className="block md:hidden space-y-6">
          {alternatif.map((alt) => (
            <Card key={alt.id} className="border border-neutral-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-neutral-800">{alt.nama}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {kriteria.map((k) => (
                    <div key={k.id} className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-700">{k.nama}</span>
                        <Badge variant="secondary" className={k.atribut === "Benefit" ? "bg-emerald-100 text-emerald-700 text-xs" : "bg-orange-100 text-orange-700 text-xs"}>
                          {k.atribut}
                        </Badge>
                      </div>
                      <Input type="number" min="0" max="100" value={penilaian[alt.id]?.[k.id] || ""} onChange={(e) => onValueChange(alt.id, k.id, e.target.value)} className="w-full text-center" placeholder="0-100" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48 font-semibold">Alternatif</TableHead>
                {kriteria.map((k) => (
                  <TableHead key={k.id} className="text-center min-w-32">
                    <div>
                      <div className="font-semibold">{k.nama}</div>
                      <div className="text-xs text-neutral-500 mt-1">
                        <Badge variant="secondary" className={k.atribut === "Benefit" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}>
                          {k.atribut}
                        </Badge>
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {alternatif.map((alt) => (
                <TableRow key={alt.id}>
                  <TableCell className="font-medium bg-neutral-50">{alt.nama}</TableCell>
                  {kriteria.map((k) => (
                    <TableCell key={k.id} className="text-center">
                      <Input type="number" min="0" max="100" value={penilaian[alt.id]?.[k.id] || ""} onChange={(e) => onValueChange(alt.id, k.id, e.target.value)} className="w-20 text-center mx-auto" placeholder="0" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
