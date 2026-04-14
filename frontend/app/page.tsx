import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold mb-6" style={{color: '#E85D04'}}>
          Jouw verhaal. In vuur en staal.
        </h1>
        <p className="text-xl text-gray-300 mb-10">
          Upload een foto en wij maken er een uniek lasersnijpatroon van voor jouw vuurkorf.
          Cortenstaal, RVS of zwart staal — handgemaakt in Nederland.
        </p>
        <Link
          href="/configurator"
          className="inline-block px-10 py-4 rounded-lg text-white font-semibold text-lg transition-all hover:scale-105"
          style={{backgroundColor: '#E85D04'}}
        >
          Start jouw ontwerp
        </Link>
        <div className="grid grid-cols-3 gap-6 mt-20">
          {[
            {label: 'Cortenstaal', price: '€89', desc: 'Roestpatina, klassiek buiten'},
            {label: 'RVS', price: '€149', desc: 'Weerbestendig, modern'},
            {label: 'Zwart staal', price: '€69', desc: 'Mat zwart, tijdloos'},
          ].map((m) => (
            <div key={m.label} className="rounded-xl p-6 text-center" style={{backgroundColor: '#2A2A2A'}}>
              <div className="text-2xl font-bold" style={{color: '#E85D04'}}>{m.price}</div>
              <div className="font-semibold mt-1">{m.label}</div>
              <div className="text-sm text-gray-400 mt-1">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
