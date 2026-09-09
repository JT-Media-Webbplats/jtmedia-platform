import ContactCard from './ContactCard'

export default function NotLinked({ email }: { email: string | undefined }) {
  return (
    <div className="max-w-2xl">
      <h1 className="font-playfair font-black text-3xl md:text-4xl text-black mb-3">Välkommen!</h1>
      <p className="text-black/55 leading-relaxed mb-8">
        Ditt konto <span className="font-semibold text-black">{email}</span> är ännu inte kopplat till
        något kundkonto hos JT Media. Det brukar bero på att du loggat in med en annan e-postadress än den vi
        har registrerad. Hör av dig så kopplar vi ihop det på en gång.
      </p>
      <ContactCard />
    </div>
  )
}
