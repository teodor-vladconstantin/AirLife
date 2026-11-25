import Blog from "@/views/Blog";
import { loadPosts } from "@/lib/catalog";

export const revalidate = 300;

export default async function Page() {
  return <Blog posts={await loadPosts()} />;
}
