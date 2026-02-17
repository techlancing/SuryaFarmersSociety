import { FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth, type UserRole } from '../auth/AuthContext'
import logo from '../assets/surya-logo.svg'

const ROLES: UserRole[] = ['chairman', 'manager', 'employee']

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: Location } }
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [role, setRole] = useState<UserRole>('employee')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!username.trim()) {
      setError('Username is required')
      return
    }

    setLoading(true)
    try {
      // For now this is a front-end only "login".
      // Later you can replace this with a real API call that
      // returns token + role from the Node.js backend.
      const fakeUser = {
        id: crypto.randomUUID(),
        name: username.trim(),
        role,
        token: 'FAKE_TOKEN_REPLACE_WITH_REAL',
      } as const

      login(fakeUser)

      const redirectTo =
        location.state?.from?.pathname && location.state.from.pathname !== '/login'
          ? location.state.from.pathname
          : '/'

      navigate(redirectTo, { replace: true })
    } catch (e) {
      console.error(e)
      setError('Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <img src={logo} alt="Surya Farmers Society" className="auth-logo" />
          <div>
            <h1 className="auth-title">Surya Farmers Admin</h1>
            <p className="auth-subtitle">Secure access for staff and management</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Username
            <input
              type="text"
              className="auth-input"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="auth-label">
            Role
            <select
              className="auth-input"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

