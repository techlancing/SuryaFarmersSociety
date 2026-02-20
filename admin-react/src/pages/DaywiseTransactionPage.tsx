import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import { getTransactionsBetweenDates } from '../api/services/transaction'
import type { Transaction } from '../api/services/transaction'
import type { ApiError } from '../api/client'

/** Convert YYYY-MM-DD to DD-MM-YYYY for API */
function toApiDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}-${m}-${y}`
}

interface FormValues {
  fromDate: string
  toDate: string
}

export function DaywiseTransactionPage() {
  const [showReport, setShowReport] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totals, setTotals] = useState({ credit: 0, debit: 0, balance: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { fromDate: '', toDate: '' },
  })

  const onSubmit = async (values: FormValues) => {
    if (!values.fromDate || !values.toDate) return
    const from = new Date(values.fromDate)
    const to = new Date(values.toDate)
    if (to < from) return
    setError(null)
    setLoading(true)
    try {
      const list = await getTransactionsBetweenDates({
        from_date: toApiDate(values.fromDate),
        to_date: toApiDate(values.toDate),
      })
      const txns = Array.isArray(list) ? list : []
      setTransactions(txns)
      const credit = txns.reduce((s, t) => s + (Number(t.nCreditAmount) || 0), 0)
      const debit = txns.reduce((s, t) => s + (Number(t.nDebitAmount) || 0), 0)
      setTotals({ credit, debit, balance: debit - credit })
      setShowReport(true)
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to load transactions')
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        Day Wise Transaction
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select date range to get day-wise transactions. To date must be on or after from date.
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Date Range
            </Typography>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} md={3}>
                <Controller
                  name="fromDate"
                  control={control}
                  rules={{ required: 'From date is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      size="small"
                      fullWidth
                      label="From Date"
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.fromDate)}
                      helperText={errors.fromDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="toDate"
                  control={control}
                  rules={{
                    required: 'To date is required',
                    validate: (v, form) => {
                      if (!v || !form.fromDate) return true
                      if (new Date(v) < new Date(form.fromDate)) return 'To date must be on or after from date'
                      return true
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      size="small"
                      fullWidth
                      label="To Date"
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.toDate)}
                      helperText={errors.toDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button type="submit" variant="contained" sx={{ mt: 0.5 }} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Get Statement'}
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button type="button" variant="outlined" sx={{ mt: 0.5 }} disabled={!showReport} onClick={() => window.print()}>
                  Print
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {showReport && (
          <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }} className="report-print-area">
            <CardContent>
              <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                <Typography variant="body2">Credit: <strong>{totals.credit.toLocaleString()}</strong></Typography>
                <Typography variant="body2">Debit: <strong>{totals.debit.toLocaleString()}</strong></Typography>
                <Typography variant="body2">Balance: <strong>{totals.balance.toLocaleString()}</strong></Typography>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Account No</TableCell>
                    <TableCell>Account Type</TableCell>
                    <TableCell align="right">Credit</TableCell>
                    <TableCell align="right">Debit</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell>Txn ID</TableCell>
                    <TableCell>Narration</TableCell>
                    <TableCell>Employee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((t, i) => (
                    <TableRow key={t._id ?? i}>
                      <TableCell>{t.sDate ?? '–'}</TableCell>
                      <TableCell>{t.sAccountNo ?? '–'}</TableCell>
                      <TableCell>{t.sAccountType ?? '–'}</TableCell>
                      <TableCell align="right">{t.nCreditAmount ? Number(t.nCreditAmount).toLocaleString() : '–'}</TableCell>
                      <TableCell align="right">{t.nDebitAmount ? Number(t.nDebitAmount).toLocaleString() : '–'}</TableCell>
                      <TableCell align="right">{(t.nBalanceAmount != null) ? Number(t.nBalanceAmount).toLocaleString() : '–'}</TableCell>
                      <TableCell>{t.nTransactionId ?? '–'}</TableCell>
                      <TableCell>{t.sNarration ?? '–'}</TableCell>
                      <TableCell>{t.sEmployeeName ?? '–'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </Box>
    </div>
  )
}
