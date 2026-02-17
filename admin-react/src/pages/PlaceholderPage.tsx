import { Card, CardContent, Typography } from '@mui/material'

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="page">
      <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This screen is defined in the Angular admin. The React + Enlite implementation will go
            here.
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

