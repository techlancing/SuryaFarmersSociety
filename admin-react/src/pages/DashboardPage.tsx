import { Grid, Card, CardContent, Typography } from '@mui/material'
import { useAuth } from '../auth/AuthContext'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Welcome{user ? `, ${user.name}` : ''}. Your role is{' '}
        <strong>{user?.role ?? 'unknown'}</strong>.
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Active Savings Accounts
              </Typography>
              <Typography variant="h5">1,248</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Total Deposits
              </Typography>
              <Typography variant="h5">₹ 3.42 Cr</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Active Loans
              </Typography>
              <Typography variant="h5">312</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

