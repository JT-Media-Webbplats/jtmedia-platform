import { createClient } from '@/lib/supabase/server'

export default async function CustomerDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Välkommen tillbaka
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Inloggad som{' '}
        <span className="text-gray-700">{user?.email ?? 'okänd'}</span>
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {[
          {
            title: 'Mina projekt',
            desc: 'Se status och leveranser för dina pågående projekt.',
            href: '/customer/projects',
          },
          {
            title: 'Filer & material',
            desc: 'Ladda ner färdigt material och godkänn utkast.',
            href: '/customer/files',
          },
          {
            title: 'Fakturor',
            desc: 'Visa och ladda ner dina fakturor.',
            href: '/customer/invoices',
          },
          {
            title: 'Support',
            desc: 'Skicka ett ärende eller chatta med oss.',
            href: '/customer/support',
          },
        ].map((card) => (
          <a
            key={card.href}
            href={card.href}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-brand-500 hover:shadow-sm transition-all group"
          >
            <h2 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors mb-1">
              {card.title}
            </h2>
            <p className="text-sm text-gray-500">{card.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
