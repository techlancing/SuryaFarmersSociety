import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Box, CircularProgress, Typography } from '@mui/material'

/**
 * Logout route: clears session and redirects to login.
 * Used when user clicks "Logout" in the sidebar.
 */
export function LogoutPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  return (
    <div className="page">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, gap: 2 }}>
        <CircularProgress size={32} />
        <Typography variant="body2" color="text.secondary">
          Logging out...
        </Typography>
      </Box>
    </div>
  )
}
