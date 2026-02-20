import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
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
import { toApiDate, aggregateByMonth } from '../api/reportUtils'
import type { ApiError } from '../api/client'

interface FormValues {
  fromDate: string
  toDate: string
}

export function Last12MonthsTransactionPage() {
  const [showReport, setShowReport] = useState(false)
  const [rows, setRows] = useState<Array<{ month: string; nCreditAmount: number; nDebitAmount: number; nBalanceAmount: number }>>([])
  const [totals, setTotals] = useState({ credit: 0, debit: 0, balance: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { fromDate: '', toDate: '' },
  })

  const onSubmit = async (values: FormValues) => {
    if (!values.fromDate || !values.toDate) return
    if (new Date(values.toDate) < new Date(values.fromDate)) return
    setError(null)
    setLoading(true)
    try {
      const list = await getTransactionsBetweenDates({
        from_date: toApiDate(values.fromDate),
        to_date: toApiDate(values.toDate),
      })
      const txns = Array.isArray(list) ? list : []
      const aggregated = aggregateByMonth(txns)
      setRows(aggregated)
      const credit = aggregated.reduce((s, r) => s + r.nCreditAmount, 0)
      const debit = aggregated.reduce((s, r) => s + r.nDebitAmount, 0)
      setTotals({ credit, debit, balance: debit - credit })
      setShowReport(true)
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to load transactions')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>Last 12 Months Transaction</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select date range to get month-wise transaction summary. To date must be on or after from date.
      </Typography>
      {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
              <Controller
                name="fromDate"
                control={control}
                rules={{ required: 'From date is required' }}
                render={({ field }) => (
                  <TextField {...field} type="date" size="small" label="From Date" InputLabelProps={{ shrink: true }} error={Boolean(errors.fromDate)} helperText={errors.fromDate?.message} sx={{ minWidth: 160 }} />
                )}
              />
              <Controller
                name="toDate"
                control={control}
                rules={{
                  required: 'To date is required',
                  validate: (v, form) => (!v || !form.fromDate) ? true : (new Date(v) >= new Date(form.fromDate) ? true : 'To date must be on or after from date'),
                }}
                render={({ field }) => (
                  <TextField {...field} type="date" size="small" label="To Date" InputLabelProps={{ shrink: true }} error={Boolean(errors.toDate)} helperText={errors.toDate?.message} sx={{ minWidth: 160 }} />
                )}
              />
              <Button type="submit" variant="contained" sx={{ mt: 0.5 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Get Statement'}
              </Button>
              <Button type="button" variant="outlined" sx={{ mt: 0.5 }} disabled={!showReport} onClick={() => window.print()}>Print</Button>
            </Box>
          </CardContent>
        </Card>
        {showReport && (
          <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }} className="report-print-area">
            <CardContent>
              <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                <Typography variant="body2">Total Credit: <strong>{totals.credit.toLocaleString()}</strong></Typography>
                <Typography variant="body2">Total Debit: <strong>{totals.debit.toLocaleString()}</strong></Typography>
                <Typography variant="body2">Balance: <strong>{totals.balance.toLocaleString()}</strong></Typography>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Credit</TableCell>
                    <TableCell align="right">Debit</TableCell>
                    <TableCell align="right">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.month}</TableCell>
                      <TableCell align="right">{r.nCreditAmount.toLocaleString()}</TableCell>
                      <TableCell align="right">{r.nDebitAmount.toLocaleString()}</TableCell>
                      <TableCell align="right">{r.nBalanceAmount.toLocaleString()}</TableCell>
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
