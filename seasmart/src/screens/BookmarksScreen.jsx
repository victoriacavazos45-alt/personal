import { useApp } from '../App'
import { useRouter } from '../lib/router'
import Layout from '../components/Layout'
import Illustration from '../components/Illustration'
import { BookmarkIcon, Button, Card } from '../components/ui'
import { QUESTION_BY_ID } from '../data/questions'
import { CATEGORIES, CATEGORY_LABEL } from '../data/categories'
import { clampQuestionCount } from '../lib/validate'

export default function BookmarksScreen() {
  const { navigate } = useRouter()
  const { bookmarks, toggleBookmark } = useApp()

  const saved = [...bookmarks].map((id) => QUESTION_BY_ID[id]).filter(Boolean)

  function startBookmarkQuiz() {
    navigate('/quiz', {
      mode: 'bookmarks',
      count: clampQuestionCount(saved.length),
      categories: CATEGORIES.map((c) => c.id),
      adaptive: false,
      onlyIds: saved.map((q) => q.id),
    })
  }

  return (
    <Layout title="Bookmarked questions" backTo="/home">
      {saved.length === 0 ? (
        <div className="text-center py-14">
          <BookmarkIcon className="w-8 h-8 mx-auto text-beige-dark" />
          <p className="font-sans text-[15px] text-navy-mist mt-4 max-w-xs mx-auto leading-relaxed">
            Nothing saved yet. Tap the bookmark on any question during a quiz to build your own review bank.
          </p>
          <Button className="mt-6" onClick={() => navigate('/quiz-setup')}>
            Start a quiz
          </Button>
        </div>
      ) : (
        <>
          <Button onClick={startBookmarkQuiz} disabled={saved.length < 1} className="w-full mb-6">
            Quiz me on these {saved.length} question{saved.length === 1 ? '' : 's'}
          </Button>

          <div className="space-y-4">
            {saved.map((q) => (
              <Card key={q.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-gold mb-1.5">
                      {CATEGORY_LABEL[q.category]} · {q.rule}
                    </p>
                    <p className="font-serif text-[17px] text-navy leading-snug">{q.question}</p>
                  </div>
                  <button
                    onClick={() => toggleBookmark(q.id)}
                    aria-label="Remove bookmark"
                    className="shrink-0 p-1 text-gold"
                  >
                    <BookmarkIcon filled />
                  </button>
                </div>
                {q.illo && <Illustration illo={q.illo} />}
                <details className="mt-3">
                  <summary className="font-sans text-[13px] text-navy-mist cursor-pointer select-none">
                    Show answer
                  </summary>
                  <p className="font-sans text-[14px] text-ink mt-2">{q.correct}</p>
                </details>
              </Card>
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}
