import { FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth, type UserRole } from '../auth/AuthContext'
import { login as apiLogin } from '../api/services/account'
import type { ApiError } from '../api/client'
import logo from '../assets/surya-logo.svg'

const ROLES: UserRole[] = ['chairman', 'manager', 'employee']

function normalizeRole(sRole: string): UserRole {
  const r = (sRole || '').toLowerCase()
  if (r === 'chairman' || r === 'manager') return r
  return 'employee'
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: Location } }
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('employee')
  const [useApi, setUseApi] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (useApi) {
      if (!email.trim()) {
        setError('Email is required')
        return
      }
      if (!password) {
        setError('Password is required')
        return
      }
    } else {
      if (!email.trim()) {
        setError('Username is required')
        return
      }
    }

    setLoading(true)
    try {
      if (useApi) {
        const res = await apiLogin({ sEmail: email.trim(), sPassword: password })
        login({
          id: res.sUserEmail,
          name: res.sUserName || res.sUserEmail,
          role: normalizeRole(res.sRole),
          token: res._token,
        })
      } else {
        login({
          id: crypto.randomUUID(),
          name: email.trim(),
          role,
          token: 'FAKE_TOKEN_OFFLINE',
        })
      }

      const redirectTo =
        location.state?.from?.pathname && location.state.from.pathname !== '/login'
          ? location.state.from.pathname
          : '/'

      navigate(redirectTo, { replace: true })
    } catch (e) {
      const err = e as ApiError
      const message =
        err?.message ||
        (err?.status === 401 ? 'Invalid email or password.' : 'Unable to sign in. Please try again.')
      setError(message)
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
            {useApi ? 'Email' : 'Username'}
            <input
              type={useApi ? 'email' : 'text'}
              className="auth-input"
              autoComplete={useApi ? 'email' : 'username'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {useApi && (
            <label className="auth-label">
              Password
              <input
                type="password"
                className="auth-input"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}

          {!useApi && (
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
          )}

          <label className="auth-label" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={useApi}
              onChange={(e) => setUseApi(e.target.checked)}
            />
            <span>Sign in with Node API</span>
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
