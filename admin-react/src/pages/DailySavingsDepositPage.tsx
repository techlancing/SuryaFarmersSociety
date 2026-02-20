import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
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
import { useMemo, useState, useEffect } from 'react'
import * as bankaccountApi from '../api/services/bankaccount'
import * as savingstypeApi from '../api/services/savingstype'
import * as dailysavingdepositApi from '../api/services/dailysavingdeposit'
import * as transactionApi from '../api/services/transaction'
import { toApiDate } from '../api/reportUtils'
import type { BankAccount } from '../api/services/bankaccount'
import type { Transaction } from '../api/services/transaction'

interface DailySavingsFormValues {
  startDate: string
  dailyAmount: string
  totalDays: string
  receiverName: string
  narration: string
}

export function DailySavingsDepositPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAccountNo, setSelectedAccountNo] = useState<string>('')
  const [dailySavingsId, setDailySavingsId] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTx, setLoadingTx] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DailySavingsFormValues>({
    defaultValues: {
      startDate: '',
      dailyAmount: '',
      totalDays: '1',
      receiverName: '',
      narration: '',
    },
  })

  useEffect(() => {
    bankaccountApi.getActiveBankAccounts().then((list) => {
      setAccounts(Array.isArray(list) ? list : [])
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedAccountNo) {
      setDailySavingsId(null)
      setTransactions([])
      return
    }
    setDailySavingsId(null)
    savingstypeApi.savingstypeList({ sAccountNo: selectedAccountNo }).then((list) => {
      const daily = Array.isArray(list) ? list.find((s) => (s.sTypeofSavings ?? '').toLowerCase().includes('daily')) : null
      setDailySavingsId(daily?.nSavingsId ?? null)
    })
  }, [selectedAccountNo])

  useEffect(() => {
    if (!selectedAccountNo || dailySavingsId == null) {
      setTransactions([])
      return
    }
    setLoadingTx(true)
    const end = new Date()
    const start = new Date(end)
    start.setFullYear(start.getFullYear() - 1)
    const from = toApiDate(start.toISOString().slice(0, 10))
    const to = toApiDate(end.toISOString().slice(0, 10))
    transactionApi.getTransactionsBetweenDates({ from_date: from, to_date: to }).then((tx) => {
      const list = Array.isArray(tx) ? tx : []
      setTransactions(list.filter((t) => t.sAccountNo === selectedAccountNo && t.nLoanId === dailySavingsId))
    }).finally(() => setLoadingTx(false))
  }, [selectedAccountNo, dailySavingsId])

  const selectedAccount = useMemo(() => accounts.find((a) => a.sAccountNo === selectedAccountNo), [accounts, selectedAccountNo])

  const onSubmit = async (values: DailySavingsFormValues) => {
    if (!selectedAccountNo || dailySavingsId == null) {
      alert('Please select an account with Daily Deposit saving type.')
      return
    }
    const dailyAmount = Number(values.dailyAmount)
    const totalDays = Number(values.totalDays) || 1
    if (Number.isNaN(dailyAmount) || dailyAmount <= 0 || totalDays < 1) {
      alert('Daily amount and number of days must be positive.')
      return
    }
    setSubmitting(true)
    try {
      const res = await dailysavingdepositApi.addDailydeposittransaction({
        sAccountNo: selectedAccountNo,
        nAccountId: dailySavingsId,
        nDayAmount: dailyAmount,
        nTotaldays: totalDays,
        sStartDate: toApiDate(values.startDate),
        sNarration: values.narration,
        sReceiverName: values.receiverName,
      })
      const id = res?.id ?? '–'
      if (res?.status === 'A-Pending') {
        alert(`A previous transaction is pending approval. Transaction id "${id}".`)
      } else {
        alert(`Amount deposited successfully. Transaction id "${id}" needs to be approved.`)
        setTransactions((prev) => prev)
      }
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? 'Failed to submit'
      alert(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePrint = () => {
    if (!selectedAccount) {
      alert('Please select an account before printing.')
      return
    }
    window.print()
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        Daily Savings Deposit
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select a savings account to view its transactions and record a new daily savings deposit.
      </Typography>

      {loading && <Box sx={{ py: 2 }}><CircularProgress /></Box>}
      {!loading && (
      <Grid container spacing={2} sx={{ mb: 2, mt: 0.5 }}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            size="small"
            fullWidth
            label="Select Account"
            value={selectedAccountNo}
            onChange={(e) => setSelectedAccountNo(e.target.value)}
          >
            <MenuItem value="">Select account</MenuItem>
            {accounts.map((a) => (
              <MenuItem key={a.sAccountNo} value={a.sAccountNo ?? ''}>
                {a.sAccountNo} – {a.sApplicantName ?? a.sApplicantSurName ?? '–'}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      )}

      {selectedAccountNo && dailySavingsId == null && !loading && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          No Daily Deposit saving type found for this account. Select another account.
        </Typography>
      )}
      {selectedAccountNo && dailySavingsId != null && (
        <>
          <Card
            elevation={0}
            sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1.5,
                }}
              >
                <Typography variant="subtitle1">Savings Account Transactions</Typography>
                <Button variant="outlined" size="small" onClick={handlePrint}>
                  Print
                </Button>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Account Number</TableCell>
                    <TableCell align="right">Credit</TableCell>
                    <TableCell align="right">Debit</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Narration</TableCell>
                    <TableCell>Employee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingTx && (
                    <TableRow>
                      <TableCell colSpan={8}><CircularProgress size={24} /></TableCell>
                    </TableRow>
                  )}
                  {!loadingTx && transactions.map((t) => (
                    <TableRow key={t.nTransactionId ?? t._id}>
                      <TableCell>{t.sDate ?? '–'}</TableCell>
                      <TableCell>{t.sAccountNo ?? '–'}</TableCell>
                      <TableCell align="right">
                        {t.nCreditAmount ? Number(t.nCreditAmount).toLocaleString() : '–'}
                      </TableCell>
                      <TableCell align="right">
                        {t.nDebitAmount ? Number(t.nDebitAmount).toLocaleString() : '–'}
                      </TableCell>
                      <TableCell align="right">
                        {(t.nBalanceAmount != null) ? Number(t.nBalanceAmount).toLocaleString() : '–'}
                      </TableCell>
                      <TableCell>{t.nTransactionId ?? '–'}</TableCell>
                      <TableCell>{t.sNarration ?? '–'}</TableCell>
                      <TableCell>{t.sEmployeeName ?? '–'}</TableCell>
                    </TableRow>
                  ))}
                  {!loadingTx && transactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography variant="body2" color="text.secondary">
                          No transactions found for this Daily Deposit.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}
          >
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Savings Account – Debit
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ mt: 1 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="startDate"
                      control={control}
                      rules={{ required: 'Start date is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          size="small"
                          fullWidth
                          label="Start Date"
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.startDate)}
                          helperText={errors.startDate?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="dailyAmount"
                      control={control}
                      rules={{ required: 'Daily amount is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          size="small"
                          fullWidth
                          label="Daily Amount"
                          inputProps={{ min: 0, step: 0.01 }}
                          error={Boolean(errors.dailyAmount)}
                          helperText={errors.dailyAmount?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="totalDays"
                      control={control}
                      rules={{ required: 'Number of days is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          size="small"
                          fullWidth
                          label="Number of Days"
                          inputProps={{ min: 1 }}
                          error={Boolean(errors.totalDays)}
                          helperText={errors.totalDays?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="receiverName"
                      control={control}
                      rules={{ required: 'Received employee is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          fullWidth
                          label="Received Employee"
                          error={Boolean(errors.receiverName)}
                          helperText={errors.receiverName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="narration"
                      control={control}
                      rules={{ required: 'Narration is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          fullWidth
                          label="Narration"
                          error={Boolean(errors.narration)}
                          helperText={errors.narration?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Submitting…' : 'Deposit & Send SMS'}
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => window.location.reload()}
                      >
                        Clear
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

