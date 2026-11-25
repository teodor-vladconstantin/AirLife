import { Button as RButton } from "@react-email/components";
import type { ReactNode } from "react";
import { brand } from "../brand";

// One of these per email. Dark green for contrast with white text.
export const Button = ({ href, children }: { href: string; children: ReactNode }) => (
  <RButton
    href={href}
    style={{
      background: brand.greenDark,
      color: "#fff",
      fontSize: 16,
      fontWeight: 600,
      padding: "14px 28px",
      borderRadius: 8,
      textDecoration: "none",
      display: "inline-block",
    }}
  >
    {children}
  </RButton>
);
