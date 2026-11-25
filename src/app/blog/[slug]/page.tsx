import { notFound } from "next/navigation";
import BlogPost from "@/views/BlogPost";
import { loadPost } from "@/lib/catalog";

export const revalidate = 300;

export const generateStaticParams = () => []; // cache pages on first hit (ISR)
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const data = await loadPost((await params).slug);
  if (!data) notFound();
  return <BlogPost post={data.post} related={data.related} />;
}
