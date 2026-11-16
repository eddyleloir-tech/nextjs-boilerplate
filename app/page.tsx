export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Le bilan mensuel de vos clients, envoyé sans y penser
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Pour les prestataires qui s'occupent de chiens et de chats : saisissez
          vos chiffres en une minute, et Rapport envoie un bilan soigné à vos
          clients le 1er du mois.
        </p>
        <a
          href="/login"
          className="mt-10 inline-block rounded-lg bg-black px-8 py-3 font-semibold text-white"
        >
          Commencer
        </a>
      </section>

      <section className="mx-auto grid max-w-4xl gap-6 px-6 pb-16 sm:grid-cols-3">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Saisie en une minute</h2>
          <p className="mt-2 text-gray-600">
            Quelques chiffres par client, pas de tableur compliqué.
          </p>
        </div>
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">À vos couleurs</h2>
          <p className="mt-2 text-gray-600">
            Un rapport mis en page aux couleurs de votre activité.
          </p>
        </div>
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Envoi automatique</h2>
          <p className="mt-2 text-gray-600">
            Programmé le 1er du mois, avec accusé de lecture.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-md px-6 pb-24 text-center">
        <div className="rounded-2xl border-2 border-black p-8">
          <p className="text-5xl font-bold">39 €</p>
          <p className="mt-1 text-gray-600">par mois</p>
          <p className="mt-4">Jusqu'à 10 clients suivis</p>
        </div>
      </section>
    </main>
  );
}
