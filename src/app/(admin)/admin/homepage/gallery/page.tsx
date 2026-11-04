import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Images } from "lucide-react";
import { getGalleryImages } from "@/lib/queries/gallery";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import { GalleryManager } from "@/components/admin/GalleryManager";

export const metadata = { title: "Gallery Images" };
export const instant = false;

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/homepage/gallery");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const images = await getGalleryImages();

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/admin/homepage"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Homepage settings
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
          <Images className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gallery images</h1>
          <p className="text-sm text-slate-500">
            Manage the photos shown in the &ldquo;Moments&rdquo; section on the homepage.
          </p>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          Upload new image
        </h2>
        <GalleryUpload />
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Current images ({images.length})
          </h2>
          {images.length > 0 && (
            <p className="text-xs text-slate-500">Hover to reorder or delete</p>
          )}
        </div>
        <GalleryManager images={images} />
      </section>
    </main>
  );
}
