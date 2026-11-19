import { Body, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { company, ANPC_URL, SAL_URL } from "../../data/company";
import { brand } from "../brand";

type Props = { preview: string; unsubscribeUrl?: string; children: ReactNode; reason?: string };

// Shared shell: preheader, branded header, content card, footer with unsubscribe (no company legal data, user decision 2026-11-18).
export function Layout({
  preview,
  unsubscribeUrl,
  children,
  reason = "Primești acest email pentru că te-ai abonat la noutățile AirLife pe airlife.ro.",
}: Props) {
  const small = { fontSize: 12, lineHeight: "18px", color: brand.muted, margin: "0 0 6px" };
  const link = { color: brand.muted, textDecoration: "underline" };
  return (
    <Html lang="ro">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, padding: "24px 12px", background: brand.bg, fontFamily: brand.font, color: brand.ink }}>
        <Container style={{ maxWidth: 600, margin: "0 auto" }}>
          <Section style={{ background: brand.green, borderRadius: "12px 12px 0 0", padding: "18px 28px" }}>
            <Link href={brand.site} style={{ textDecoration: "none" }}>
              <Img src={brand.logo} width={134} height={30} alt="AirLife" style={{ display: "block" }} />
            </Link>
          </Section>

          <Section style={{ background: "#fff", padding: "32px 28px", border: `1px solid ${brand.border}`, borderTop: 0 }}>
            {children}
          </Section>

          <Section style={{ padding: "20px 28px 0" }}>
            <Text style={small}>
              {reason}
              {unsubscribeUrl && (
                <>
                  {" "}
                  <Link href={unsubscribeUrl} style={link}>
                    Dezabonare cu un click
                  </Link>
                </>
              )}
            </Text>
            <Hr style={{ borderColor: brand.border, margin: "14px 0" }} />
            <Text style={small}>
              <Link href={`mailto:${company.email}`} style={link}>
                {company.email}
              </Link>{" "}
              |{" "}
              <Link href="tel:+40722153525" style={link}>
                {company.phone}
              </Link>
            </Text>
            <Text style={small}>
              <Link href={`${brand.site}/politica-de-confidentialitate`} style={link}>
                Confidențialitate
              </Link>{" "}
              |{" "}
              <Link href={ANPC_URL} style={link}>
                ANPC
              </Link>{" "}
              |{" "}
              <Link href={SAL_URL} style={link}>
                SAL
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
