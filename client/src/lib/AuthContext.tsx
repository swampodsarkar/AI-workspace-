import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, signOut, updateProfile, User
} from 'firebase/auth'
import { auth, githubProvider } from '../lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, username: string) => Promise<void>
  loginWithGithub: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signup = async (email: string, password: string, username: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: username })
    // Also update Firebase Realtime DB with user info
    const { getDatabase, ref, set } = await import('firebase/database')
    const db = getDatabase()
    await set(ref(db, `users/${cred.user.uid}`), {
      username,
      email,
      createdAt: Date.now(),
      plan: 'free'
    })
  }

  const loginWithGithub = async () => {
    await signInWithPopup(auth, githubProvider)
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGithub, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
