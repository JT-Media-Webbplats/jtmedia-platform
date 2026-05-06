import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-white flex items-center justify-center px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="font-bakerie text-brand-green-dark text-base mb-4 tracking-wide">
          404
        </p>
        <h1 className="text-5xl sm:text-6xl font-black text-black leading-tight mb-5">
          Sidan kunde inte hittas.
        </h1>
        <p className="text-lg text-black/50 leading-relaxed mb-10">
          Länken är fel eller så har sidan flyttats. Gå tillbaka till startsidan
          och börja om därifrån.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-black px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
          style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
        >
          Till startsidan
        </Link>
      </div>
    </main>
  )
}
