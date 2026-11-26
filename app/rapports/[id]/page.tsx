"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Rapport = {
  mois: string;
  nb_visites: number | null;
  nb_promenades: number | null;
  commentaire: string | null;
  client_id: string;
};

const COULEUR = "#2f855a";

export default function RapportDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [rapport, setRapport] = useState<Rapport | null>(null);
  const [client, setClient] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function charger() {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) {
        router.replace("/login");
        return;
      }
      const r = await supabase
        .from("rapports")
        .select("mois, nb_visites, nb_promenades, commentaire, client_id")
        .eq("id", params.id)
        .single();
      if (r.error) {
        setMessage(r.error.message);
        return;
      }
      setRapport(r.data);
      const c = await supabase
        .from("clients")
        .select("nom")
        .eq("id", r.data.client_id)
        .single();
      setClient(c.data?.nom ?? "");
    }
    charger();
  }, [params.id, router]);

  if (message) {
    return <p className="p-6 text-red-600">{message}</p>;
  }

  if (!rapport) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Chargement…</p>
      </main>
    );
  }

  const moisTexte = new Date(rapport.mois + "T12:00:00").toLocaleDateString(
    "fr-FR",
    { month: "long", year: "numeric" }
  );

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <a href="/rapports" className="text-sm text-gray-600 underline">
        ← Bilans
      </a>

      <div className="mt-6 overflow-hidden rounded-2xl border shadow-sm">
        <div className="p-6 text-white" style={{ backgroundColor: COULEUR }}>
          <p className="text-sm uppercase tracking-wide opacity-80">
            Bilan du mois
          </p>
          <h1 className="mt-1 text-2xl font-bold capitalize">{moisTexte}</h1>
          <p className="mt-2">Pour {client}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6">
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <p className="text-4xl font-bold" style={{ color: COULEUR }}>
              {rapport.nb_visites ?? 0}
            </p>
            <p className="mt-1 text-sm text-gray-600">visites</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <p className="text-4xl font-bold" style={{ color: COULEUR }}>
              {rapport.nb_promenades ?? 0}
            </p>
            <p className="mt-1 text-sm text-gray-600">promenades</p>
          </div>
        </div>

        {rapport.commentaire && (
          <div className="border-t p-6">
            <p className="text-sm font-semibold text-gray-700">Le petit mot</p>
            <p className="mt-2 whitespace-pre-line text-gray-800">
              {rapport.commentaire}
            </p>
          </div>
        )}

        <div className="border-t bg-gray-50 p-4 text-center text-xs text-gray-500">
          Merci de votre confiance 🐾
        </div>
      </div>
    </main>
  );
}
