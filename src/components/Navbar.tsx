import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  User,
  LogOut,
  ShieldCheck,
  Package,
  Wrench,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Activity,
  Phone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CartButton } from "@/components/cart/CartButton";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/localSeo";
import { trackClickToCall } from "@/lib/analytics";

const Navbar = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdmin(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdmin(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .single();

    setIsAdmin(!!data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity"
            aria-label="AirLife Acasă"
          >
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">AirLife</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link to="/products">
              <Button variant="ghost" size="sm">
                Magazin
              </Button>
            </Link>

            {/* Servicii Buzau Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <span>Servicii Buzău</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-2">
                <DropdownMenuItem onClick={() => navigate("/servicii")} className="cursor-pointer">
                  <div className="font-semibold text-foreground">Toate Serviciile Buzău</div>
                </DropdownMenuItem>
                <div className="h-px bg-border my-1" />
                <DropdownMenuItem
                  onClick={() => navigate("/servicii/montaj-aer-conditionat-buzau")}
                  className="cursor-pointer"
                >
                  <Wrench className="w-4 h-4 mr-2 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Montaj Aer Condiționat</div>
                    <span className="text-[11px] text-muted-foreground block">
                      Instalare curată cu vidare
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/servicii/igienizare-aer-conditionat-buzau")}
                  className="cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Igienizare &amp; Curățare</div>
                    <span className="text-[11px] text-muted-foreground block">
                      Dezinfectare cu husă etanșă
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/servicii/service-aer-conditionat-buzau")}
                  className="cursor-pointer"
                >
                  <Activity className="w-4 h-4 mr-2 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Service &amp; Reparații</div>
                    <span className="text-[11px] text-muted-foreground block">
                      Diagnosticare &amp; piese
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/blog">
              <Button variant="ghost" size="sm">
                Blog
              </Button>
            </Link>

            <Link to="/despre-noi">
              <Button variant="ghost" size="sm">
                Despre Noi
              </Button>
            </Link>

            <Link to="/contact">
              <Button variant="ghost" size="sm">
                Contact
              </Button>
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              onClick={() => trackClickToCall("navbar")}
              className="hidden lg:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              aria-label={`Sună la ${PHONE_DISPLAY}`}
            >
              <Phone className="w-4 h-4" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              onClick={() => trackClickToCall("navbar-mobile")}
              className="lg:hidden p-2 rounded-md text-primary hover:bg-secondary"
              aria-label={`Sună la ${PHONE_DISPLAY}`}
            >
              <Phone className="w-5 h-5" />
            </a>
            <CartButton />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Cont utilizator">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <ShieldCheck className="w-4 h-4 mr-2 text-primary" />
                      Panou Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate("/my-orders")}>
                    <Package className="w-4 h-4 mr-2" />
                    Comenzile Mele
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2 text-destructive" />
                    Deconectare
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="hidden sm:inline-block">
                <Button size="sm">Conectare</Button>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Deschide meniul"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-border mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-secondary text-sm font-medium"
            >
              Toate Produsele
            </Link>
            <div className="px-3 py-1 text-xs font-semibold uppercase text-primary tracking-wider">
              Servicii Buzău
            </div>
            <Link
              to="/servicii/montaj-aer-conditionat-buzau"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-1.5 rounded-md hover:bg-secondary text-xs text-muted-foreground hover:text-foreground"
            >
              • Montaj Aer Condiționat Buzău
            </Link>
            <Link
              to="/servicii/igienizare-aer-conditionat-buzau"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-1.5 rounded-md hover:bg-secondary text-xs text-muted-foreground hover:text-foreground"
            >
              • Igienizare &amp; Dezinfectare AC
            </Link>
            <Link
              to="/servicii/service-aer-conditionat-buzau"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-1.5 rounded-md hover:bg-secondary text-xs text-muted-foreground hover:text-foreground"
            >
              • Service &amp; Reparații Climatizare
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-secondary text-sm font-medium"
            >
              Blog
            </Link>
            <Link
              to="/despre-noi"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-secondary text-sm font-medium"
            >
              Despre Noi
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-secondary text-sm font-medium"
            >
              Contact &amp; Suport
            </Link>
            {!user && (
              <div className="pt-2">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="w-full block">
                  <Button size="sm" className="w-full">
                    Conectare / Cont Nou
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
