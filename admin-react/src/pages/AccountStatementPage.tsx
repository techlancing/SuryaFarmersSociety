import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { getTransactionsBetweenDates } from '../api/services/transaction'
import { getActiveBankAccounts } from '../api/services/bankaccount'
import { toApiDate } from '../api/reportUtils'
import type { BankAccount } from '../api/services/bankaccount'
import type { Transaction } from '../api/services/transaction'
import type { ApiError } from '../api/client'

interface FormValues {
  accountNo: string
  fromDate: string
  toDate: string
}

export function AccountStatementPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [statement, setStatement] = useState<Transaction[]>([])
  const [showStatement, setShowStatement] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getActiveBankAccounts().then((list) => setAccounts(Array.isArray(list) ? list : [])).catch(() => setAccounts([]))
  }, [])

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { accountNo: '', fromDate: '', toDate: '' },
  })

  const onSubmit = async (values: FormValues) => {
    if (!values.accountNo || !values.fromDate || !values.toDate) return
    if (new Date(values.toDate) < new Date(values.fromDate)) return
    setError(null)
    setLoading(true)
    try {
      const list = await getTransactionsBetweenDates({
        from_date: toApiDate(values.fromDate),
        to_date: toApiDate(values.toDate),
      })
      const txns = (Array.isArray(list) ? list : []).filter((t) => t.sAccountNo === values.accountNo)
      setStatement(txns)
      setShowStatement(true)
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to load statement')
      setStatement([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>Bank Account Statement</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select account and date range to get statement. To date must be on or after from date.
      </Typography>
      {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Statement</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
              <Controller
                name="accountNo"
                control={control}
                rules={{ required: 'Account is required' }}
                render={({ field }) => (
                  <TextField {...field} select size="small" label="Account Number" error={Boolean(errors.accountNo)} helperText={errors.accountNo?.message} sx={{ minWidth: 260 }}>
                    <MenuItem value="">Select account</MenuItem>
                    {accounts.map((a) => (
                      <MenuItem key={a._id ?? a.sAccountNo} value={a.sAccountNo ?? ''}>{a.sAccountNo} – {a.sApplicantName ?? '–'}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller name="fromDate" control={control} rules={{ required: 'From date is required' }}
                render={({ field }) => (
                  <TextField {...field} type="date" size="small" label="From Date" InputLabelProps={{ shrink: true }} error={Boolean(errors.fromDate)} helperText={errors.fromDate?.message} sx={{ minWidth: 160 }} />
                )}
              />
              <Controller name="toDate" control={control}
                rules={{ required: 'To date is required', validate: (v, form) => (!v || !form.fromDate) ? true : (new Date(v) >= new Date(form.fromDate) ? true : 'To date must be on or after from date') }}
                render={({ field }) => (
                  <TextField {...field} type="date" size="small" label="To Date" InputLabelProps={{ shrink: true }} error={Boolean(errors.toDate)} helperText={errors.toDate?.message} sx={{ minWidth: 160 }} />
                )}
              />
              <Button type="submit" variant="contained" sx={{ mt: 0.5 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Get Statement'}
              </Button>
              <Button type="button" variant="outlined" sx={{ mt: 0.5 }} disabled={!showStatement} onClick={() => window.print()}>Print</Button>
            </Box>
          </CardContent>
        </Card>
        {showStatement && (
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb' }} className="statement-print-area">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Account Statement</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Narration</TableCell>
                    <TableCell align="right">Credit</TableCell>
                    <TableCell align="right">Debit</TableCell>
                    <TableCell align="right">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statement.map((t, i) => (
                    <TableRow key={t._id ?? i}>
                      <TableCell>{t.sDate ?? '–'}</TableCell>
                      <TableCell>{t.sNarration ?? '–'}</TableCell>
                      <TableCell align="right">{t.nCreditAmount ? Number(t.nCreditAmount).toLocaleString() : '–'}</TableCell>
                      <TableCell align="right">{t.nDebitAmount ? Number(t.nDebitAmount).toLocaleString() : '–'}</TableCell>
                      <TableCell align="right">{t.nBalanceAmount != null ? Number(t.nBalanceAmount).toLocaleString() : '–'}</TableCell>
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
