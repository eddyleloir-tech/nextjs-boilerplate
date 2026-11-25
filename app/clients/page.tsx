"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Client = {
  id: string;
  nom: string;
  email: string;
  forfait: number | null;
};

export default function Clients() {
  const router = useRouter();
  const [pret, setPret] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [forfait, setForfait] = useState("");
  const [message, setMessage] = useState("");

  async function charger() {
    const { data, error } = await supabase
      .from("clients")
      .select("id, nom, email, forfait")
      .order("created_at", { ascending: false });
    if (error) {
      setMessage(error.message);
    } else {
      setClients(data ?? []);
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

  async function ajouter(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (clients.length >= 10) {
      setMessage("Limite de 10 clients atteinte.");
      return;
    }
    const { error } = await supabase.from("clients").insert({
      nom,
      email,
      forfait: forfait ? Number(forfait) : null,
    });
    if (error) {
      setMessage(error.message);
      return;
    }
    setNom("");
    setEmail("");
    setForfait("");
    await charger();
  }

  async function supprimer(id: string) {
    if (!window.confirm("Supprimer ce client ?")) return;
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) {
      setMessage(error.message);
    } else {
      await charger();
    }
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
      <a href="/dashboard" className="text-sm text-gray-600 underline">
        ← Tableau de bord
      </a>
      <h1 className="mt-4 text-2xl font-bold">Mes clients</h1>
      <p className="mt-1 text-gray-600">{clients.length} / 10 clients</p>

      <form onSubmit={ajouter} className="mt-8 space-y-3">
        <input
          required
          placeholder="Nom du client"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
        <input
          required
          type="email"
          placeholder="Email du client"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Forfait mensuel en € (facultatif)"
          value={forfait}
          onChange={(e) => setForfait(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-black p-3 font-semibold text-white"
        >
          Ajouter le client
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

      <ul className="mt-8 space-y-3">
        {clients.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div>
              <p className="font-semibold">{c.nom}</p>
              <p className="text-sm text-gray-600">{c.email}</p>
              {c.forfait !== null && (
                <p className="text-sm text-gray-600">{c.forfait} € / mois</p>
              )}
            </div>
            <button
              onClick={() => supprimer(c.id)}
              className="text-sm text-red-600 underline"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
