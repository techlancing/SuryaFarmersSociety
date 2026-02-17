import type { ReactNode } from 'react'
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../auth/AuthContext'
import { Sidebar } from './Sidebar'
import logo from '../assets/surya-logo.svg'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth()

  return (
    <div className="admin-shell">
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        className="admin-appbar"
        sx={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}
      >
        <Toolbar sx={{ px: 3, minHeight: 64 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexGrow: 1 }}>
            <Box
              component="img"
              src={logo}
              alt="Surya Farmers Society"
              sx={{ width: 30, height: 30, display: 'block' }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 600, letterSpacing: 0.5 }}
            >
              Surya Farmers Admin
            </Typography>
          </Box>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ textTransform: 'capitalize', opacity: 0.8 }}>
                  {user.role}
                </Typography>
              </Box>
              <IconButton
                aria-label="logout"
                color="inherit"
                size="small"
                onClick={logout}
                sx={{ ml: 0.5 }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <div className="admin-body">
        <aside className="admin-sidebar">
          <Sidebar />
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  )
}

