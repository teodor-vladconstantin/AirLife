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

// Row styles for the phone menu: big text, 56px rows, one tap each.
const MOBILE_ROW = "flex min-h-14 w-full items-center justify-between text-left text-lg font-semibold text-foreground";
const MOBILE_SUB = "flex min-h-12 items-center justify-between rounded-md px-3 text-base text-foreground active:bg-secondary";

const Navbar = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const menu = useShopMenu();
  const [servOpen, setServOpen] = useState(false);
  const closeMenu = () => setMobileMenuOpen(false);
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
    <nav className={`border-b sticky top-0 z-50 ${mobileMenuOpen ? "bg-background" : "bg-background/80 backdrop-blur-md"}`}>
      <CampaignBanner />
      <div className="container mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex min-h-11 shrink-0 items-center gap-2 text-primary hover:opacity-90 transition-opacity"
            aria-label="AirLife Acasă"
          >
            <img src="/logo-sm.png" alt="AirLife" width={161} height={36} className="h-8 w-auto max-w-none sm:h-9" />
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
              className="hidden sm:inline-flex xl:hidden h-11 w-11 items-center justify-center rounded-md text-primary hover:bg-secondary"
              aria-label={`Sună la ${PHONE_DISPLAY}`}
            >
              <Phone className="w-5 h-5" />
            </a>
            <Link to="/favorite" aria-label={`Favorite${wish.signedIn && wish.count ? ` (${wish.count})` : ""}`} className="relative hidden h-11 w-11 items-center justify-center rounded-md hover:bg-secondary sm:inline-flex">
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
                <Button variant="outline">Conectare</Button>
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

        {/* Mobile menu: 5 big rows, two of them expand (progressive disclosure); account + favorites quiet at the bottom. */}
        {mobileMenuOpen && (
          <div className="lg:hidden -mx-4 mt-3 max-h-[calc(100dvh-8.5rem)] overflow-y-auto overscroll-contain border-t border-border bg-background px-4 animate-in slide-in-from-top-2 duration-200">
            <ul className="divide-y divide-border">
              <li>
                <button type="button" onClick={() => setCatsOpen((v) => !v)} aria-expanded={catsOpen} className={MOBILE_ROW}>
                  Produse <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${catsOpen ? "rotate-180" : ""}`} />
                </button>
                {catsOpen && (
                  <ul className="mb-3 space-y-1 rounded-lg bg-secondary/60 p-2">
                    <li><Link to="/produse" onClick={closeMenu} className={MOBILE_SUB + " font-semibold text-primary"}>Toate produsele <span aria-hidden>→</span></Link></li>
                    {menu.map((sec) => (
                      <li key={sec.key}><Link to={sectionHref(sec.names)} onClick={closeMenu} className={MOBILE_SUB}>{sec.title}</Link></li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <button type="button" onClick={() => setServOpen((v) => !v)} aria-expanded={servOpen} className={MOBILE_ROW}>
                  Servicii <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${servOpen ? "rotate-180" : ""}`} />
                </button>
                {servOpen && (
                  <ul className="mb-3 space-y-1 rounded-lg bg-secondary/60 p-2">
                    <li><Link to="/servicii/montaj-aer-conditionat-buzau" onClick={closeMenu} className={MOBILE_SUB}>Montaj aer condiționat</Link></li>
                    <li><Link to="/servicii/igienizare-aer-conditionat-buzau" onClick={closeMenu} className={MOBILE_SUB}>Igienizare &amp; dezinfectare</Link></li>
                    <li><Link to="/servicii/service-aer-conditionat-buzau" onClick={closeMenu} className={MOBILE_SUB}>Service &amp; reparații</Link></li>
                  </ul>
                )}
              </li>
              <li><Link to="/blog" onClick={closeMenu} className={MOBILE_ROW}>Blog</Link></li>
              <li><Link to="/despre-noi" onClick={closeMenu} className={MOBILE_ROW}>Despre noi</Link></li>
              <li><Link to="/contact" onClick={closeMenu} className={MOBILE_ROW}>Contact</Link></li>
            </ul>
            <div className="flex items-center justify-between gap-4 border-t border-border py-2 text-sm text-muted-foreground">
              <Link to="/favorite" onClick={closeMenu} className="inline-flex min-h-11 items-center gap-2 font-medium hover:text-foreground">
                <Heart className="h-4 w-4" />Favorite{wish.signedIn && wish.count ? ` (${wish.count})` : ""}
              </Link>
              {!user && (
                <Link to="/auth" rel="nofollow" onClick={closeMenu} className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary">
                  <User className="h-4 w-4" />Conectare
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
