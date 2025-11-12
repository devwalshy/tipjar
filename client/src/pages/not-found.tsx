import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="w-full flex items-center justify-center p-8"
      data-oid="k9_t99u"
    >
      <div className="card w-full max-w-md" data-oid="g3guq9t">
        <div className="card-header flex items-center" data-oid="sh92m8x">
          <AlertCircle
            className="h-6 w-6 mr-2 text-[#dd7895]"
            data-oid="uy46cbi"
          />

          <div
            className="text-2xl font-semibold tracking-tight text-[#f5f5f5]"
            data-oid="v9yfq47"
          >
            404 Page Not Found
          </div>
        </div>

        <div className="card-body" data-oid="f3-r7zl">
          <p className="text-[#f5f5f5]" data-oid="3ee:p.b">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="mt-6" data-oid="vw.iey_">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
              className="btn btn-primary"
              data-oid="n_cujqk"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
