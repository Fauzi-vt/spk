"use client";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";
import { ClipboardList, Shirt, Calculator, Scale, Cog, Trophy, Download, FactoryIcon as Fabric } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Input Kriteria",
    url: "/kriteria",
    icon: ClipboardList,
  },
  {
    title: "Input Alternatif Bahan",
    url: "/alternatif",
    icon: Shirt,
  },
  {
    title: "Penilaian Alternatif",
    url: "/penilaian",
    icon: Calculator,
  },
  {
    title: "Pembobotan Kriteria",
    url: "/pembobotan",
    icon: Scale,
  },
  {
    title: "Proses Perhitungan",
    url: "/perhitungan",
    icon: Cog,
  },
  {
    title: "Hasil Akhir",
    url: "/hasil",
    icon: Trophy,
  },
  {
    title: "Export Laporan",
    url: "/export",
    icon: Download,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-neutral-200 bg-neutral-100">
      <SidebarHeader className="p-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Fabric className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-800">SPK Fabric</h2>
            <p className="text-xs text-neutral-600">TOPSIS Method</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="w-full justify-start px-3 py-2 text-sm font-medium rounded-lg hover:bg-neutral-200 data-[active=true]:bg-indigo-600 data-[active=true]:text-white">
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
