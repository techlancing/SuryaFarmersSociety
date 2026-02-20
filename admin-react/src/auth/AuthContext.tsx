import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type UserRole = 'chairman' | 'manager' | 'employee'

export interface AuthUser {
  id: string
  name: string
  role: UserRole
  token: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'userData'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)

  // Hydrate from localStorage on first load (mirrors Angular/Node API behaviour)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      const token = parsed?.token ?? parsed?._token
      const role = parsed?.sRole ?? parsed?.role
      if (parsed && role && token) {
        const normalisedRole: UserRole =
          role === 'chairman' || role === 'manager'
            ? role
            : 'employee'

        setUser({
          id: parsed._id ?? parsed.sUserEmail ?? 'unknown',
          name: parsed.sName ?? parsed.sUserName ?? parsed.username ?? 'User',
          role: normalisedRole,
          token,
        })
      }
    } catch {
      // Ignore bad data; user will have to log in again
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const login = (authUser: AuthUser) => {
    setUser(authUser)
    // Store in a shape compatible with Node API and Angular (token for API client)
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        _id: authUser.id,
        sName: authUser.name,
        sUserName: authUser.name,
        sRole: authUser.role,
        token: authUser.token,
        _token: authUser.token,
      }),
    )
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

