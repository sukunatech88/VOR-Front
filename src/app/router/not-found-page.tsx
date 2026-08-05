import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../shared/components/ui/card";

export function NotFoundPage() {
  return <Card role="alert">
    <p className="text-xs font-medium uppercase text-slate-500">404</p>
    <h1 className="mt-2 text-xl font-semibold text-white">Page not found</h1>
    <p className="mt-2 text-sm text-slate-400">The requested VOR workspace page does not exist.</p>
    <Link className="mt-5 inline-flex items-center gap-2 text-sm text-indigo-300 hover:underline" to="/dashboard"><ArrowLeft className="h-4 w-4"/>Return to Dashboard</Link>
  </Card>;
}
