// Email-safe brand tokens, the AirLife brand book colors, same as src/index.css (email clients have no CSS variables).
export const brand = {
  site: "https://airlife.ro",
  logo: "https://airlife.ro/logo-mono-white.png", // white logo for the green header bar; PNG: SVG is not reliable in email clients
  green: "#08AC48", // Verde AirLife (brand book)
  greenDark: "#0A7A35", // Verde text (brand book): buttons with white text
  ink: "#0F2A1D",
  muted: "#4A5F54",
  bg: "#F4F8F5",
  border: "#e2ece6",
  font: "Inter, -apple-system, 'Segoe UI', Arial, sans-serif",
};

// Tags every link so GA4 can attribute site visits to the campaign.
export const utm = (path: string, campaign: string) =>
  `${brand.site}${path}${path.includes("?") ? "&" : "?"}utm_source=newsletter&utm_medium=email&utm_campaign=${campaign}`;
