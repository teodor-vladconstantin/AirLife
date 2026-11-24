"use client";
import { useState, useEffect } from "react";
import CampaignBanner from "@/components/CampaignBanner";
import { Link, useNavigate } from "@/lib/router";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
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
  Heart,
  Wind,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryMenu, SECTION_ICONS, sectionHref, useShopMenu } from "@/components/shop/CategoryMenu";
import { useWishlist } from "@/lib/wishlist";
import { SearchBox } from "@/components/shop/SearchBox";
import { CartButton } from "@/components/cart/CartButton";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/localSeo";
import { trackClickToCall } from "@/lib/analytics";

const Navbar = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const menu = useShopMenu();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const wish = useWishlist();
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
      <CampaignBanner />
      <div className="container mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-primary hover:opacity-90 transition-opacity"
            aria-label="AirLife Acasă"
          >
            <img src="/logo.png" alt="AirLife" width={161} height={36} className="h-8 w-auto max-w-none sm:h-9" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <CategoryMenu />

            {/* Servicii Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <span>Servicii</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-2">
                <DropdownMenuItem onClick={() => navigate("/servicii")} className="cursor-pointer">
                  <div className="font-semibold text-foreground">Toate Serviciile</div>
                </DropdownMenuItem>
                <div className="h-px bg-border my-1" />
                <DropdownMenuItem
                  onClick={() => navigate("/servicii/montaj-aer-conditionat-buzau")}
                  className="cursor-pointer"
                >
                  <Wrench className="w-4 h-4 mr-2 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Montaj aer condiționat</div>
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

          <SearchBox className="mx-3 hidden w-56 xl:block 2xl:w-72" />

          {/* Right Action Buttons */}
          <div className="flex items-center gap-0.5 sm:gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              onClick={() => trackClickToCall("navbar")}
              className="hidden xl:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              aria-label={`Sună la ${PHONE_DISPLAY}`}
            >
              <Phone className="w-4 h-4" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              onClick={() => trackClickToCall("navbar-mobile")}
              className="hidden sm:inline-flex xl:hidden p-2 rounded-md text-primary hover:bg-secondary"
              aria-label={`Sună la ${PHONE_DISPLAY}`}
            >
              <Phone className="w-5 h-5" />
            </a>
            <Link to="/favorite" aria-label={`Favorite${wish.signedIn && wish.count ? ` (${wish.count})` : ""}`} className="relative hidden h-10 w-10 items-center justify-center rounded-md hover:bg-secondary sm:inline-flex">
              <Heart className="h-5 w-5" />
              {wish.signedIn && wish.count > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">{wish.count > 99 ? "99+" : wish.count}</span>}
            </Link>
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
                  <DropdownMenuItem onClick={() => navigate("/cont")}>
                    <User className="w-4 h-4 mr-2" />
                    Contul meu
                  </DropdownMenuItem>
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
              <Link to="/auth" rel="nofollow" className="hidden sm:inline-block">
                <Button size="sm">Conectare</Button>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Deschide meniul"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <div className="pt-3 xl:hidden"><SearchBox /></div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-4 pb-3 border-t border-border mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain">
            <button type="button" onClick={() => setCatsOpen((v) => !v)} aria-expanded={catsOpen} className="flex w-full items-center justify-between rounded-lg bg-primary/5 px-3 py-3 text-base font-extrabold text-foreground">
              Produse <ChevronDown className={`h-5 w-5 text-primary transition-transform ${catsOpen ? "rotate-180" : ""}`} />
            </button>
            {catsOpen && (
              <div className="space-y-3 pb-1">
                <Link to="/produse" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
                  Toate produsele <span aria-hidden>→</span>
                </Link>
                {menu.map((sec) => {
                  const Icon = SECTION_ICONS[sec.key as keyof typeof SECTION_ICONS] ?? Wind;
                  const open = openSection === sec.key;
                  return (
                    <div key={sec.key} className={`overflow-hidden rounded-xl border ${open ? "border-primary/40 shadow-sm" : "border-border"} bg-card`}>
                      <button type="button" onClick={() => setOpenSection((v) => (v === sec.key ? null : sec.key))} aria-expanded={open} className="flex w-full items-center gap-3 p-3 text-left">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-extrabold leading-tight text-foreground">{sec.title}</span>
                          {sec.description && <span className="block text-xs text-muted-foreground">{sec.description}</span>}
                        </span>
                        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                      {open && (
                        <div className="border-t border-border bg-secondary/20 px-3 pb-3 pt-2">
                          {sec.groups.map((g) => (
                            <div key={g.title} className="pt-2">
                              <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary">{g.title}<span className="h-px flex-1 bg-border" aria-hidden /></p>
                              <ul className="divide-y divide-border/70 rounded-lg border border-border/70 bg-card">
                                {g.links.map((l) => (
                                  <li key={l.slug}>
                                    <Link to={`/${l.slug}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between gap-2 px-3 py-3 text-[15px] font-medium text-foreground active:bg-secondary">
                                      <span>{l.name}</span>
                                      <span className="flex items-center gap-2">{l.count != null && <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">{l.count}</span>}<span className="text-muted-foreground" aria-hidden>›</span></span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          <Link to={sectionHref(sec.names)} onClick={() => setMobileMenuOpen(false)} className="mt-3 flex items-center justify-center rounded-lg border border-primary/40 py-2.5 text-sm font-bold text-primary">Vezi tot din {sec.title.toLowerCase()} →</Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 sm:hidden">
              <Link to="/favorite" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-semibold"><Heart className="h-4 w-4" />Favorite{wish.signedIn && wish.count ? ` (${wish.count})` : ""}</Link>
              <a href={`tel:${PHONE_TEL}`} onClick={() => trackClickToCall("navbar-mobile-menu")} className="flex items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-semibold text-primary"><Phone className="h-4 w-4" />Sună</a>
            </div>
            <div className="px-3 py-1 text-xs font-semibold uppercase text-primary tracking-wider">
              Servicii
            </div>
            <Link
              to="/servicii/montaj-aer-conditionat-buzau"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-1.5 rounded-md hover:bg-secondary text-xs text-muted-foreground hover:text-foreground"
            >
              • Montaj Aer Condiționat
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
                <Link to="/auth" rel="nofollow" onClick={() => setMobileMenuOpen(false)} className="w-full block">
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
