"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inscription, setInscription] = useState(false);
  const [message, setMessage] = useState("");

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (inscription) {
      const { error } = await supabase.auth.signUp({ email, password });
      setMessage(
        error
          ? error.message
          : "Compte créé. Vérifiez votre boîte mail pour confirmer."
      );
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setMessage(error ? error.message : "Connexion réussie.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <form onSubmit={envoyer} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">
          {inscription ? "Créer un compte" : "Se connecter"}
        </h1>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-black p-3 font-semibold text-white"
        >
          {inscription ? "Créer mon compte" : "Me connecter"}
        </button>
        <button
          type="button"
          onClick={() => setInscription(!inscription)}
          className="w-full text-sm text-gray-600 underline"
        >
          {inscription
            ? "J'ai déjà un compte"
            : "Pas de compte ? Créer un compte"}
        </button>
        {message && <p className="text-sm">{message}</p>}
      </form>
    </main>
  );
}
