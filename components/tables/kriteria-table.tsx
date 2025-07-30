"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2 } from "lucide-react";
import type { KriteriaTableProps } from "@/types";

export function KriteriaTable({ kriteria, onEdit, onDelete }: KriteriaTableProps) {
  if (kriteria.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-semibold text-neutral-700">Ringkasan Kriteria ({kriteria.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile Card View */}
        <div className="block md:hidden space-y-4">
          {kriteria.map((item, index) => (
            <Card key={item.id} className="border border-neutral-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-500 mb-1">#{index + 1}</p>
                    <h3 className="font-semibold text-neutral-800 truncate">{item.nama}</h3>
                  </div>
                  <div className="flex gap-1 ml-2">
                    {onEdit && (
                      <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 w-8 p-0">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-neutral-600">
                    Bobot: <span className="font-medium">{item.bobot}</span>
                  </div>
                  <Badge variant="secondary" className={item.atribut === "Benefit" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-orange-100 text-orange-700 hover:bg-orange-200"}>
                    {item.atribut}
                  </Badge>
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
                <TableHead className="w-16">No</TableHead>
                <TableHead>Nama Kriteria</TableHead>
                <TableHead className="w-20">Bobot</TableHead>
                <TableHead className="w-24">Atribut</TableHead>
                <TableHead className="w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kriteria.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell className="text-center">{item.bobot}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={item.atribut === "Benefit" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-orange-100 text-orange-700 hover:bg-orange-200"}>
                      {item.atribut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {onEdit && (
                        <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 w-8 p-0">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
