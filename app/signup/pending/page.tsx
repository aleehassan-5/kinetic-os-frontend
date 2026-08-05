import Link from "next/link";
import { Clock } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function SignupPendingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-9 flex items-center gap-2.5">
        <Logo />
        <span className="font-display text-[16px] font-semibold tracking-tight text-text-primary">Kinetic OS</span>
      </div>

      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warning-muted">
        <Clock className="h-6 w-6 text-warning" />
      </div>

      <h1 className="mt-6 font-display text-[24px] font-medium tracking-tight text-text-primary">
        Your account is under review
      </h1>
      <p className="mt-2 max-w-[380px] text-[13.5px] leading-relaxed text-text-secondary">
        Thanks for applying. We review every new account before it goes live — you'll get an email the
        moment yours is approved, usually within a business day.
      </p>

      <Link
        href="/login"
        className="mt-8 text-[13px] font-medium text-primary hover:text-primary-hover"
      >
        Back to sign in
      </Link>
    </div>
  );
}
