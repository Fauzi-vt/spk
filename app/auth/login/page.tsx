"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Eye, EyeOff, Mail, Lock, UserPlus, LogIn, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage({ type: "error", text: error.message });
        } else {
          setMessage({ type: "success", text: "Login berhasil! Redirecting..." });
          router.push("/kriteria");
        }
      } else {
        // Register
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          setMessage({ type: "error", text: error.message });
        } else {
          setMessage({
            type: "success",
            text: "Registrasi berhasil! Silakan cek email Anda untuk konfirmasi.",
          });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan. Silakan coba lagi." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TOPSIS Rizki Batik</h1>
          <p className="text-gray-600">Sistem Pendukung Keputusan Pemilihan Bahan Kain</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">{isLogin ? "Masuk ke Akun" : "Buat Akun Baru"}</CardTitle>
            <CardDescription>{isLogin ? "Masukkan email dan password Anda" : "Lengkapi data untuk membuat akun"}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {message && <AlertBanner type={message.type} title={message.type === "success" ? "Berhasil!" : "Error!"} description={message.text} icon={message.type === "success" ? CheckCircle : AlertCircle} />}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <div className="relative">
                    <Input id="fullName" type="text" placeholder="Masukkan nama lengkap" value={fullName} onChange={(e) => setFullName(e.target.value)} required={!isLogin} className="pl-10" />
                    <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input id="email" type="email" placeholder="contoh@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 pr-10" />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    {isLogin ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                    {isLogin ? "Masuk" : "Daftar"}
                  </>
                )}
              </Button>
            </form>

            {/* Toggle Login/Register */}
            <div className="text-center text-sm">
              <span className="text-gray-600">{isLogin ? "Belum punya akun?" : "Sudah punya akun?"}</span>
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="ml-1 text-indigo-600 hover:text-indigo-700 font-medium">
                {isLogin ? "Daftar di sini" : "Masuk di sini"}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2025 Rizki Batik. Sistem TOPSIS untuk pemilihan bahan kain terbaik.</p>
        </div>
      </div>
    </div>
  );
}
