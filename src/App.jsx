import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, supabaseConfigured } from './lib/supabaseClient'
import { createStore } from './lib/store'
import { RouterProvider, useRouter } from './lib/router'
import { Spinner, Wordmark } from './components/ui'
import AuthScreen from './screens/AuthScreen'
import HomeScreen from './screens/HomeScreen'
import QuizSetupScreen from './screens/QuizSetupScreen'
import QuizScreen from './screens/QuizScreen'
import ResultsScreen from './screens/ResultsScreen'
import BookmarksScreen from './screens/BookmarksScreen'
import DashboardScreen from './screens/DashboardScreen'
import RulesIndexScreen from './screens/RulesIndexScreen'
import RuleReaderScreen from './screens/RuleReaderScreen'
import BoardScreen from './screens/BoardScreen'
import MnemonicsScreen from './screens/MnemonicsScreen'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

function Shell() {
  const [authState, setAuthState] = useState({ loading: supabaseConfigured, user: null })
  const [localMode, setLocalMode] = useState(!supabaseConfigured)
  const [localEntered, setLocalEntered] = useState(false)

  useEffect(() => {
    if (!supabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => {
      setAuthState({ loading: false, user: data.session?.user ?? null })
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({ loading: false, user: session?.user ?? null })
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  if (authState.loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const signedIn = supabaseConfigured ? Boolean(authState.user) : localEnabled(localMode, localEntered)
  if (!signedIn) {
    return <AuthScreen onLocalEnter={() => setLocalEntered(true)} />
  }

  return <SignedInApp user={authState.user ?? { id: 'local' }} localMode={localMode} />
}

function localEnabled(localMode, localEntered) {
  return localMode && localEntered
}

function SignedInApp({ user, localMode }) {
  const { route } = useRouter()
  const store = useMemo(() => createStore(user.id), [user.id])

  const [data, setData] = useState({
    loading: true,
    bookmarks: new Set(),
    questionStats: {},
    categoryStats: {},
    userStats: null,
    annotations: [],
    mnemonicFavorites: new Set(),
  })

  const refresh = useCallback(async () => {
    const [bookmarks, questionStats, categoryStats, userStats, annotations, mnemonicFavorites] =
      await Promise.all([
        store.getBookmarks(),
        store.getQuestionStats(),
        store.getCategoryStats(),
        store.getUserStats(),
        store.getAnnotations(),
        store.getMnemonicFavorites(),
      ])
    setData({ loading: false, bookmarks, questionStats, categoryStats, userStats, annotations, mnemonicFavorites })
  }, [store])

  useEffect(() => {
    store
      .recordLogin()
      .catch(() => {})
      .finally(refresh)
  }, [store, refresh])

  const toggleBookmark = useCallback(
    async (questionId) => {
      const on = !data.bookmarks.has(questionId)
      // optimistic
      setData((d) => {
        const next = new Set(d.bookmarks)
        if (on) next.add(questionId)
        else next.delete(questionId)
        return { ...d, bookmarks: next }
      })
      try {
        await store.toggleBookmark(questionId, on)
      } catch {
        setData((d) => {
          const next = new Set(d.bookmarks)
          if (on) next.delete(questionId)
          else next.add(questionId)
          return { ...d, bookmarks: next }
        })
      }
    },
    [store, data.bookmarks]
  )

  const signOut = useCallback(async () => {
    if (supabaseConfigured) await supabase.auth.signOut()
    else window.location.reload()
  }, [])

  const addAnnotation = useCallback(
    async (a) => {
      const row = await store.addAnnotation(a)
      setData((d) => ({ ...d, annotations: [...d.annotations, row] }))
      return row
    },
    [store]
  )

  const updateAnnotation = useCallback(
    async (id, note) => {
      await store.updateAnnotation(id, note)
      setData((d) => ({
        ...d,
        annotations: d.annotations.map((x) => (x.id === id ? { ...x, note: note || null } : x)),
      }))
    },
    [store]
  )

  const deleteAnnotation = useCallback(
    async (id) => {
      await store.deleteAnnotation(id)
      setData((d) => ({ ...d, annotations: d.annotations.filter((x) => x.id !== id) }))
    },
    [store]
  )

  const toggleMnemonicFavorite = useCallback(
    async (id) => {
      const on = !data.mnemonicFavorites.has(id)
      setData((d) => {
        const next = new Set(d.mnemonicFavorites)
        if (on) next.add(id)
        else next.delete(id)
        return { ...d, mnemonicFavorites: next }
      })
      try {
        await store.toggleMnemonicFavorite(id, on)
      } catch {
        setData((d) => {
          const next = new Set(d.mnemonicFavorites)
          if (on) next.delete(id)
          else next.add(id)
          return { ...d, mnemonicFavorites: next }
        })
      }
    },
    [store, data.mnemonicFavorites]
  )

  const ctx = {
    user,
    store,
    localMode,
    ...data,
    refresh,
    toggleBookmark,
    signOut,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    toggleMnemonicFavorite,
  }

  let screen
  if (route.path.startsWith('/quiz-setup')) screen = <QuizSetupScreen />
  else if (route.path.startsWith('/quiz')) screen = <QuizScreen config={route.state} />
  else if (route.path.startsWith('/results')) screen = <ResultsScreen summary={route.state} />
  else if (route.path.startsWith('/bookmarks')) screen = <BookmarksScreen />
  else if (route.path.startsWith('/dashboard')) screen = <DashboardScreen />
  else if (route.path.startsWith('/rules/')) screen = <RuleReaderScreen ruleId={route.path.slice('/rules/'.length)} />
  else if (route.path.startsWith('/rules')) screen = <RulesIndexScreen />
  else if (route.path.startsWith('/board')) screen = <BoardScreen />
  else if (route.path.startsWith('/mnemonics')) screen = <MnemonicsScreen />
  else screen = <HomeScreen />

  return (
    <AppContext.Provider value={ctx}>
      {data.loading ? (
        <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
          <Wordmark />
          <Spinner />
        </div>
      ) : (
        screen
      )}
    </AppContext.Provider>
  )
}

export default function App() {
  return (
    <RouterProvider>
      <Shell />
    </RouterProvider>
  )
}
