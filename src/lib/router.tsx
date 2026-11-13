"use client";
// Thin react-router-compatible layer over next/navigation, so views keep their `<Link to>` / `useNavigate()` code.
import NextLink from "next/link";
import { forwardRef, type ComponentProps } from "react";
import { useParams as useNextParams, usePathname, useRouter } from "next/navigation";

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & { to: string };

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ to, ...props }, ref) => <NextLink ref={ref} href={to} {...props} />);
Link.displayName = "Link";

export const useNavigate = () => {
  const r = useRouter();
  return (to: string | number, opts?: { replace?: boolean }) =>
    typeof to === "number" ? r.back() : opts?.replace ? r.replace(to) : r.push(to);
};

export const useLocation = () => ({ pathname: usePathname() ?? "/" });

export const useParams = <T extends Record<string, string | undefined> = Record<string, string | undefined>>() => useNextParams() as T;
