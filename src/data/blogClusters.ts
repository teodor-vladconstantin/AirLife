// Fixed order of blog clusters (category = cluster) on /blog; unknown categories go last.
export const CLUSTER_ORDER = ["Alegere aer condiționat", "Întreținere și probleme", "Aer curat", "Umiditate și ventilație"];
// Pillar article of each cluster is listed first inside its cluster.
export const PILLAR_SLUGS = ["cum-alegi-aerul-conditionat-ghid-complet"];

const rank = (c: string) => {
  const i = CLUSTER_ORDER.indexOf(c);
  return i < 0 ? CLUSTER_ORDER.length : i;
};

export const orderedClusters = (posts: { category: string | null }[]) =>
  [...new Set(posts.map((p) => p.category ?? "Ghiduri"))].sort((a, b) => rank(a) - rank(b));

export const inCluster = <T extends { slug: string; category: string | null }>(posts: T[], cluster: string) =>
  posts
    .filter((p) => (p.category ?? "Ghiduri") === cluster)
    .sort((a, b) => Number(PILLAR_SLUGS.includes(b.slug)) - Number(PILLAR_SLUGS.includes(a.slug)));
