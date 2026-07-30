"use client";

import * as React from "react";
import { Plus, Loader2, MapPin, Sparkles, Trash2, Pencil } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { api, ApiError } from "@/lib/api-client";

interface Listing {
  id: string;
  title: string;
  description: string | null;
  priceLabel: string | null;
  location: string | null;
  imageUrl: string | null;
  status: "ACTIVE" | "PAUSED" | "SOLD";
}

interface ContentPlanResult {
  audience: string;
  posts: { id: string; title: string }[];
}

const statusVariant: Record<Listing["status"], "success" | "warning" | "default"> = {
  ACTIVE: "success",
  PAUSED: "warning",
  SOLD: "default",
};

export default function ListingsPage() {
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [editing, setEditing] = React.useState<Listing | null>(null);
  const [form, setForm] = React.useState({ title: "", description: "", priceLabel: "", location: "" });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [planningId, setPlanningId] = React.useState<string | null>(null);
  const [planResult, setPlanResult] = React.useState<{ listingTitle: string; result: ContentPlanResult } | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  function load() {
    setLoading(true);
    api
      .get<{ listings: Listing[] }>("/listings")
      .then((data) => setListings(data.listings))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }

  React.useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", description: "", priceLabel: "", location: "" });
    setError(null);
    setShowForm(true);
  }

  function openEdit(listing: Listing) {
    setEditing(listing);
    setForm({
      title: listing.title,
      description: listing.description ?? "",
      priceLabel: listing.priceLabel ?? "",
      location: listing.location ?? "",
    });
    setError(null);
    setShowForm(true);
  }

  async function save() {
    if (!form.title.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        priceLabel: form.priceLabel.trim() || undefined,
        location: form.location.trim() || undefined,
      };
      if (editing) {
        await api.patch(`/listings/${editing.id}`, payload);
      } else {
        await api.post("/listings", payload);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save this listing.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setDeletingId(id);
    try {
      await api.delete(`/listings/${id}`);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch {
      // leave the list as-is; the row's still there so the user can retry
    } finally {
      setDeletingId(null);
    }
  }

  async function generatePlan(listing: Listing) {
    setPlanningId(listing.id);
    try {
      const result = await api.post<ContentPlanResult>(`/listings/${listing.id}/content-plan`, {
        platforms: ["INSTAGRAM"],
        postCount: 3,
      });
      setPlanResult({ listingTitle: listing.title, result });
    } catch (err) {
      setPlanResult({
        listingTitle: listing.title,
        result: { audience: err instanceof ApiError ? err.message : "Couldn't generate a plan right now.", posts: [] },
      });
    } finally {
      setPlanningId(null);
    }
  }

  return (
    <>
      <Topnav title="Listings" subtitle="Current offers the AI content engine can promote for you" />

      <main className="space-y-4 p-6 lg:p-8">
        <div className="flex justify-end">
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add listing
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-[13px] text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : listings.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-2 py-16">
            <p className="text-[13px] font-medium text-text-primary">No listings yet</p>
            <p className="text-[12px] text-text-muted">Add your current offers so the AI can propose content for them.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] font-semibold text-text-primary">{listing.title}</p>
                    <Badge variant={statusVariant[listing.status]}>{listing.status}</Badge>
                  </div>
                  {listing.location && (
                    <p className="mt-1 flex items-center gap-1 text-[12px] text-text-muted">
                      <MapPin className="h-3 w-3" /> {listing.location}
                    </p>
                  )}
                  {listing.priceLabel && <p className="mt-1 text-[13px] font-medium text-primary">{listing.priceLabel}</p>}
                  {listing.description && (
                    <p className="mt-2 line-clamp-2 text-[12.5px] text-text-secondary">{listing.description}</p>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => generatePlan(listing)}
                      loading={planningId === listing.id}
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Generate content plan
                    </Button>
                    <button
                      onClick={() => openEdit(listing)}
                      className="rounded-control p-2 text-text-muted transition-colors duration-200 hover:bg-white/[0.05] hover:text-text-primary"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => remove(listing.id)}
                      disabled={deletingId === listing.id}
                      className="rounded-control p-2 text-text-muted transition-colors duration-200 hover:bg-danger-muted hover:text-danger"
                      aria-label="Delete"
                    >
                      {deletingId === listing.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Modal open={showForm} onClose={() => !saving && setShowForm(false)} title={editing ? "Edit listing" : "Add listing"}>
        <div className="space-y-3">
          {error && <p className="text-[12.5px] text-danger">{error}</p>}
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. 3-bed apartment in DHA Phase 6" autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What makes this worth a closer look?"
              rows={3}
              className="w-full rounded-control border border-border bg-white/[0.03] px-3 py-2 text-[13px] text-text-primary focus:border-primary focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Price</Label>
              <Input value={form.priceLabel} onChange={(e) => setForm((f) => ({ ...f, priceLabel: e.target.value }))} placeholder="$450,000" />
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="DHA Phase 6" />
            </div>
          </div>
          <Button className="w-full" onClick={save} loading={saving} disabled={!form.title.trim()}>
            {editing ? "Save changes" : "Add listing"}
          </Button>
        </div>
      </Modal>

      <Modal open={!!planResult} onClose={() => setPlanResult(null)} title={`Content plan — ${planResult?.listingTitle ?? ""}`}>
        {planResult && (
          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-medium text-text-muted">Target audience</p>
              <p className="mt-1 text-[13px] text-text-primary">{planResult.result.audience}</p>
            </div>
            {planResult.result.posts.length > 0 && (
              <div>
                <p className="text-[11px] font-medium text-text-muted">
                  {planResult.result.posts.length} draft post{planResult.result.posts.length === 1 ? "" : "s"} created
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {planResult.result.posts.map((p) => (
                    <li key={p.id} className="rounded-control border border-border px-3 py-2 text-[12.5px] text-text-primary">
                      {p.title}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[11.5px] text-text-muted">
                  Review and schedule these from the Social Scheduler — nothing publishes automatically.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
