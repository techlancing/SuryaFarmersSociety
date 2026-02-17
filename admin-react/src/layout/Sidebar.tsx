import { NavLink } from 'react-router-dom'
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BookIcon from '@mui/icons-material/MenuBook'
import MapIcon from '@mui/icons-material/Map'
import BarChartIcon from '@mui/icons-material/BarChart'
import VerifiedIcon from '@mui/icons-material/Verified'
import LockIcon from '@mui/icons-material/Lock'
import PeopleIcon from '@mui/icons-material/People'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Fragment, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { MENU_BY_ROLE, type MenuItem } from '../config/menu'

const iconMap: Record<string, JSX.Element> = {
  dashboard: <DashboardIcon fontSize="small" />,
  book: <BookIcon fontSize="small" />,
  map: <MapIcon fontSize="small" />,
  bar_chart: <BarChartIcon fontSize="small" />,
  verified: <VerifiedIcon fontSize="small" />,
  lock: <LockIcon fontSize="small" />,
  people: <PeopleIcon fontSize="small" />,
  account_balance: <AccountBalanceIcon fontSize="small" />,
  swap_horiz: <SwapHorizIcon fontSize="small" />,
  check_circle: <CheckCircleIcon fontSize="small" />,
  logout: <LogoutIcon fontSize="small" />,
}

function MenuIconWrapper({ name }: { name?: string }) {
  if (!name) return null
  const icon = iconMap[name]
  if (!icon) return null
  return icon
}

function SidebarItem({ item, level = 0 }: { item: MenuItem; level?: number }) {
  const [open, setOpen] = useState(true)
  const hasChildren = Boolean(item.children && item.children.length > 0)

  if (hasChildren) {
    return (
      <>
        <ListItemButton
          onClick={() => setOpen((prev) => !prev)}
          sx={{
            pl: 1.5 + level * 1.5,
          }}
        >
          {item.icon && (
            <ListItemIcon sx={{ minWidth: 32 }}>
              <MenuIconWrapper name={item.icon} />
            </ListItemIcon>
          )}
          <ListItemText primary={item.label} />
          {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children!.map((child) => (
              <SidebarItem key={child.id} item={child} level={level + 1} />
            ))}
          </List>
        </Collapse>
      </>
    )
  }

  if (!item.path) {
    return null
  }

  return (
    <ListItemButton
      component={NavLink}
      to={item.path}
      sx={{
        pl: 1.5 + level * 1.5,
        '&.active': {
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          '& .MuiListItemText-primary': {
            color: '#1d4ed8',
            fontWeight: 600,
          },
        },
      }}
    >
      {item.icon && (
        <ListItemIcon sx={{ minWidth: 32 }}>
          <MenuIconWrapper name={item.icon} />
        </ListItemIcon>
      )}
      <ListItemText primary={item.label} />
    </ListItemButton>
  )
}

export function Sidebar() {
  const { user } = useAuth()
  const menu = user ? MENU_BY_ROLE[user.role] : []

  return (
    <List component="nav" dense disablePadding>
      {menu.map((item) => (
        <Fragment key={item.id}>
          <SidebarItem item={item} />
        </Fragment>
      ))}
    </List>
  )
}

