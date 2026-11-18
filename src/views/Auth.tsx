"use client";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@/lib/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const recoveryRef = useRef(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let flagged = false;
    try { flagged = sessionStorage.getItem("airlife_recovery") === "1"; } catch { /* storage blocked */ }
    if (flagged || window.location.hash.includes("type=recovery")) { recoveryRef.current = true; setRecovery(true); }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !recoveryRef.current) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") { recoveryRef.current = true; setRecovery(true); return; }
      if (session && !recoveryRef.current) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Bine ai venit!" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        toast({ title: "Cont creat cu succes!" });
      }
    } catch (error: any) {
      toast({
        title: "Eroare",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) return toast({ title: "Eroare", description: error.message, variant: "destructive" });
    try { sessionStorage.removeItem("airlife_recovery"); } catch { /* ignore */ }
    toast({ title: "Parola a fost schimbată" });
    navigate("/admin");
  };

  const handleForgot = async () => {
    if (!email) return toast({ title: "Scrie întâi emailul", variant: "destructive" });
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` });
    if (error) return toast({ title: "Eroare", description: error.message, variant: "destructive" });
    toast({ title: "Ți-am trimis un link de resetare", description: "Verifică emailul și folderul Spam." });
  };

  if (recovery) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <img src="/logo.png" alt="AirLife" width={179} height={40} className="h-10 w-auto mx-auto" />
            <CardTitle className="text-center">Alege o parolă nouă</CardTitle>
            <CardDescription className="text-center">Minim 8 caractere. Parola o știi doar tu.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNewPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Parolă nouă</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Se salvează..." : "Salvează parola"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary">
            <img src="/logo.png" alt="AirLife" width={179} height={40} className="h-10 w-auto" />
          </div>
          <CardTitle className="text-center">
            {isLogin ? "Conectează-te" : "Creează cont"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Intră în contul tău pentru a continua"
              : "Creează un cont nou pentru a cumpăra produse"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nume complet</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Ion Popescu"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@exemplu.ro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parolă</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Se încarcă..." : isLogin ? "Conectează-te" : "Creează cont"}
            </Button>
          </form>
          {isLogin && (
            <div className="mt-3 text-center">
              <button type="button" onClick={handleForgot} className="text-sm text-muted-foreground hover:underline">Ai uitat parola?</button>
            </div>
          )}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "Nu ai cont? Înregistrează-te" : "Ai deja cont? Conectează-te"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
