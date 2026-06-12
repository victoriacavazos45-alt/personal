import { useMemo, useState } from 'react'
import { useApp } from '../App'
import Layout from '../components/Layout'
import { Card, SectionLabel } from '../components/ui'
import { MNEMONICS } from '../data/mnemonics'
import { CATEGORIES } from '../data/categories'

export default function MnemonicsScreen() {
  const { mnemonicFavorites, toggleMnemonicFavorite } = useApp()
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  const grouped = useMemo(() => {
    const list = favoritesOnly ? MNEMONICS.filter((m) => mnemonicFavorites.has(m.id)) : MNEMONICS
    return CATEGORIES.map((c) => ({
      ...c,
      items: list.filter((m) => m.category === c.id),
    })).filter((g) => g.items.length > 0)
  }, [favoritesOnly, mnemonicFavorites])

  return (
    <Layout title="Mnemonic Library" backTo="/home">
      <div className="flex items-center justify-between mb-7">
        <p className="font-sans text-[14px] text-navy-mist">
          {MNEMONICS.length} sayings · {mnemonicFavorites.size} favorited
        </p>
        <button
          onClick={() => setFavoritesOnly((v) => !v)}
          className={`font-sans text-[13px] px-3 py-1.5 border transition-colors ${
            favoritesOnly ? 'bg-navy text-cream border-navy' : 'border-beige-dark text-navy-mist hover:text-navy'
          }`}
        >
          ★ Favorites
        </button>
      </div>

      {grouped.length === 0 && (
        <p className="font-sans text-[14px] text-navy-mist text-center py-10">
          No favorites yet — tap the star on any mnemonic to save it here.
        </p>
      )}

      <div className="space-y-9">
        {grouped.map((group) => (
          <section key={group.id}>
            <SectionLabel className="mb-3">{group.label}</SectionLabel>
            <div className="space-y-3">
              {group.items.map((m) => {
                const fav = mnemonicFavorites.has(m.id)
                return (
                  <Card key={m.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-gold mb-1.5">
                          {m.title} · {m.rule}
                        </p>
                        <p className="font-serif text-[19px] italic text-navy leading-snug">“{m.mnemonic}”</p>
                      </div>
                      <button
                        onClick={() => toggleMnemonicFavorite(m.id)}
                        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
                        className={`shrink-0 text-xl leading-none p-1 transition-colors ${
                          fav ? 'text-gold' : 'text-beige-dark hover:text-gold'
                        }`}
                      >
                        {fav ? '★' : '☆'}
                      </button>
                    </div>
                    <p className="font-sans text-[14px] text-navy-mist leading-relaxed mt-2.5">{m.meaning}</p>
                  </Card>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  )
}
