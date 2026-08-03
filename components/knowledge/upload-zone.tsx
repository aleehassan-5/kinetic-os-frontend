"use client";

import { useRef, useState } from "react";
import { UploadCloud, Link2, MessageSquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

export function UploadZone({
  onUploadFile,
  onCrawl,
  onAddFaq,
}: {
  onUploadFile: (file: File) => Promise<void>;
  onCrawl: (title: string, url: string) => Promise<void>;
  onAddFaq: (title: string, content: string) => Promise<void>;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [crawlOpen, setCrawlOpen] = useState(false);
  const [crawlTitle, setCrawlTitle] = useState("");
  const [crawlUrl, setCrawlUrl] = useState("");
  const [crawlSubmitting, setCrawlSubmitting] = useState(false);
  const [crawlError, setCrawlError] = useState<string | null>(null);

  const [faqOpen, setFaqOpen] = useState(false);
  const [faqTitle, setFaqTitle] = useState("");
  const [faqContent, setFaqContent] = useState("");
  const [faqSubmitting, setFaqSubmitting] = useState(false);
  const [faqError, setFaqError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUploadFile(file);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function submitCrawl() {
    if (!crawlUrl.trim() || !crawlTitle.trim()) {
      setCrawlError("Title and URL are both required.");
      return;
    }
    setCrawlSubmitting(true);
    setCrawlError(null);
    try {
      await onCrawl(crawlTitle.trim(), crawlUrl.trim());
      setCrawlOpen(false);
      setCrawlTitle("");
      setCrawlUrl("");
    } catch (err) {
      setCrawlError(err instanceof Error ? err.message : "Couldn't crawl that URL — please check it and try again.");
    } finally {
      setCrawlSubmitting(false);
    }
  }

  async function submitFaq() {
    if (!faqTitle.trim() || !faqContent.trim()) {
      setFaqError("Title and content are both required.");
      return;
    }
    setFaqSubmitting(true);
    setFaqError(null);
    try {
      await onAddFaq(faqTitle.trim(), faqContent.trim());
      setFaqOpen(false);
      setFaqTitle("");
      setFaqContent("");
    } catch (err) {
      setFaqError(err instanceof Error ? err.message : "Couldn't save that FAQ — please try again.");
    } finally {
      setFaqSubmitting(false);
    }
  }

  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !uploading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!uploading) fileInputRef.current?.click();
          }
        }}
        className={cn(
          "cursor-pointer rounded-card border-2 border-dashed p-8 text-center transition-colors duration-200",
          dragging ? "border-primary bg-primary-muted/30" : "border-border hover:border-border-strong"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.xlsx,.csv,.txt"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-muted">
          <UploadCloud className="h-5 w-5 text-primary" />
        </div>
        <p className="mt-3 text-[13.5px] font-medium text-text-primary">
          {uploading ? (
            "Uploading…"
          ) : (
            <>
              Drop files here, or{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="text-primary hover:text-primary-hover"
              >
                browse
              </button>
            </>
          )}
        </p>
        <p className="mt-1 text-[12px] text-text-secondary">PDF, DOCX, XLSX, CSV, TXT — up to 50 MB each</p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setCrawlOpen(true); }}>
            <Link2 className="h-3.5 w-3.5" /> Crawl a website
          </Button>
          <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setFaqOpen(true); }}>
            <MessageSquarePlus className="h-3.5 w-3.5" /> Add FAQ manually
          </Button>
        </div>
      </div>

      <Modal
        open={crawlOpen}
        onClose={() => !crawlSubmitting && setCrawlOpen(false)}
        title="Crawl a website"
        description="We'll fetch the page and index its text into your Knowledge Base."
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              placeholder="e.g. Pricing page"
              value={crawlTitle}
              onChange={(e) => setCrawlTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>URL</Label>
            <Input
              placeholder="https://example.com/faq"
              value={crawlUrl}
              onChange={(e) => setCrawlUrl(e.target.value)}
            />
          </div>
          {crawlError && <p className="text-[12.5px] text-danger">{crawlError}</p>}
          <Button className="w-full" onClick={submitCrawl} loading={crawlSubmitting}>
            Crawl &amp; index
          </Button>
        </div>
      </Modal>

      <Modal
        open={faqOpen}
        onClose={() => !faqSubmitting && setFaqOpen(false)}
        title="Add FAQ manually"
        description="Write a question/answer pair or any reference text to ground the AI assistant."
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              placeholder="e.g. Refund policy"
              value={faqTitle}
              onChange={(e) => setFaqTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Content</Label>
            <textarea
              rows={5}
              placeholder="Write the answer or reference content here…"
              value={faqContent}
              onChange={(e) => setFaqContent(e.target.value)}
              className="w-full rounded-control border border-border bg-white/[0.03] px-3.5 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>
          {faqError && <p className="text-[12.5px] text-danger">{faqError}</p>}
          <Button className="w-full" onClick={submitFaq} loading={faqSubmitting}>
            Save FAQ
          </Button>
        </div>
      </Modal>
    </>
  );
}
