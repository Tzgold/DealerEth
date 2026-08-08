import { Suspense } from "react";
import ProfileSetupPage from "./profile-setup-client";

export default function ProfileSetupRoute() {
  return (
    <Suspense fallback={<div className="product-editorial min-h-screen px-4 py-10 text-sm text-black/60">Loading profile…</div>}>
      <ProfileSetupPage />
    </Suspense>
  );
}
