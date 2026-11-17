// Email-safe brand tokens, converted from the HSL variables in src/index.css (email clients have no CSS variables).
export const brand = {
  site: "https://airlife.ro",
  logo: "https://airlife.ro/apple-touch-icon.png", // PNG: SVG is not reliable in email clients
  green: "#22b866", // favicon / primary
  greenDark: "#1c8749", // buttons: white text on #22b866 fails contrast, on this it passes
  ink: "#1f2e29",
  muted: "#5b6e66",
  bg: "#f3f7f5",
  border: "#e2ece6",
  font: "Inter, -apple-system, 'Segoe UI', Arial, sans-serif",
};

// Tags every link so GA4 can attribute site visits to the campaign.
export const utm = (path: string, campaign: string) =>
  `${brand.site}${path}${path.includes("?") ? "&" : "?"}utm_source=newsletter&utm_medium=email&utm_campaign=${campaign}`;
