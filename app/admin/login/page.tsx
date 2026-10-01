import type { Metadata } from "next";
import { loginAction } from "../actions";

export const metadata: Metadata = {
  title: "Admin login | Route22",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-sand-2 px-5">
      <form
        action={loginAction}
        className="w-full max-w-[380px] rounded-xl2 border border-line bg-paper p-8 shadow-card"
      >
        <h1 className="mb-1 text-[1.4rem]">Route22 admin</h1>
        <p className="mb-5 text-[0.88rem] text-ink-soft">Enter the admin password to continue.</p>
        <label className="mb-4 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
          Password
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
          />
        </label>
        {searchParams.error && (
          <p className="mb-4 text-[0.85rem] font-semibold text-clay-dk">
            Incorrect password, or admin isn&apos;t configured yet.
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-full bg-clay py-2.5 font-semibold text-white hover:bg-clay-dk"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
