"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Client = { id: string; nom: string };

type Bilan = {
  id: string;
  client_id: string;
  mois: string;
  nb_visites: number | null;
  nb_promenades: number | null;
  commentaire: string | null;
};

export default function Rapports() {
  const router = useRouter();
  const [pret, setPret] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [bilans, setBilans] = useState<Bilan[]>([]);
  const [clientId, setClientId] = useState("");
  const [mois, setMois] = useState(new Date().toISOString().slice(0, 7));
  const [visites, setVisites] = useState("");
  const [promenades, setPromenades] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState("");

  async function charger() {
    const c = await supabase.from("clients").select("id, nom").order("nom");
    if (c.error) {
      setMessage(c.error.message);
      return;
    }
    setClients(c.data ?? []);
    const b = await supabase
      .from("rapports")
      .select("id, client_id, mois, nb_visites, nb_promenades, commentaire")
      .order("created_at", { ascending: false })
      .limit(20);
    if (b.error) {
      setMessage(b.error.message);
    } else {
      setBilans(b.data ?? []);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
      } else {
        setPret(true);
        charger();
      }
    });
  }, [router]);

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setOk("");
    const { error } = await supabase.from("rapports").insert({
      client_id: clientId,
      mois: mois + "-01",
      nb_visites: visites ? Number(visites) : 0,
      nb_promenades: promenades ? Number(promenades) : 0,
      commentaire: commentaire || null,
    });
    if (error) {
      setMessage(error.message);
      return;
    }
    setVisites("");
    setPromenades("");
    setCommentaire("");
    setOk("Bilan enregistré.");
    await charger();
  }

  function nomClient(id: string) {
    return clients.find((c) => c.id === id)?.nom ?? "Client supprimé";
  }

  if (!pret) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Chargement…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <a href="/clients" className="text-sm text-gray-600 underline">
        ← Mes clients
      </a>
      <h1 className="mt-4 text-2xl font-bold">Bilan du mois</h1>

      <form onSubmit={enregistrer} className="mt-8 space-y-3">
        <select
          required
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full rounded-lg border p-3"
        >
          <option value="">Choisir un client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>
        <input
          required
          type="month"
          value={mois}
          onChange={(e) => setMois(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
        <input
          type="number"
          min="0"
          placeholder="Nombre de visites"
          value={visites}
          onChange={(e) => setVisites(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
        <input
          type="number"
          min="0"
          placeholder="Nombre de promenades"
          value={promenades}
          onChange={(e) => setPromenades(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
        <textarea
          placeholder="Petit mot pour le client (facultatif)"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          className="w-full rounded-lg border p-3"
          rows={3}
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-black p-3 font-semibold text-white"
        >
          Enregistrer le bilan
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      {ok && <p className="mt-4 text-sm text-green-700">{ok}</p>}

      <h2 className="mt-10 text-lg font-semibold">Derniers bilans</h2>
      <ul className="mt-4 space-y-3">
        {bilans.map((b) => (
          <li key={b.id} className="rounded-xl border p-4">
            <p className="font-semibold">
              {nomClient(b.client_id)} — {b.mois.slice(0, 7)}
            </p>
            <p className="text-sm text-gray-600">
              {b.nb_visites ?? 0} visites · {b.nb_promenades ?? 0} promenades
            </p>
           <a
              href={"/rapports/" + b.id}
              className="mt-2 inline-block text-sm font-semibold text-green-700 underline"
            >
              Voir le rapport →
             <a
              href={"/rapports/" + b.id}
              className="mt-2 inline-block text-sm font-semibold text-green-700 underline"
            >
              Voir le rapport →
            </a>{b.commentaire && (
              <p className="mt-1 text-sm text-gray-600">{b.commentaire}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
