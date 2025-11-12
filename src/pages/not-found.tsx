import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="card-base card-elevated flex w-full max-w-md flex-col gap-5 rounded-3xl p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-brand-forest" />
        <div>
          <h2 className="text-xl font-semibold text-text-default">Page not found</h2>
          <p className="mt-2 text-sm text-text-muted">
            The view you were looking for has moved. Let’s guide you back to the partner
            dashboard.
          </p>
        </div>
        <Link href="/">
          <a className="brand-button mx-auto w-full max-w-[220px]">Return home</a>
        </Link>
      </div>
    </div>
  );
}
