"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
      } else {
        setEmail(data.session.user.email ?? "");
      }
    });
  }, [router]);

  async function deconnexion() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (email === null) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Chargement…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      <p className="mt-2 text-gray-600">Connecté en tant que {email}</p>
      <button
        onClick={deconnexion}
        className="mt-8 rounded-lg border px-4 py-2 text-sm"
      >
        Se déconnecter
      </button>
    </main>
  );
}
