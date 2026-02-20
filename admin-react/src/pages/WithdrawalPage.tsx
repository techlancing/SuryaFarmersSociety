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
import { useState, useEffect, useMemo } from 'react'
import * as bankaccountApi from '../api/services/bankaccount'
import * as savingstypeApi from '../api/services/savingstype'
import * as dailysavingdepositApi from '../api/services/dailysavingdeposit'
import * as transactionApi from '../api/services/transaction'
import { toApiDate } from '../api/reportUtils'
import type { BankAccount } from '../api/services/bankaccount'
import type { SavingTypeDetail } from '../api/services/savingstype'
import type { Transaction } from '../api/services/transaction'

interface FormValues {
  date: string
  amount: string
  narration: string
  receiverName: string
}

const SAVINGS_TYPE_OPTIONS = [
  { value: 'Savings Account', label: 'Savings Account' },
  { value: 'Daily Deposit', label: 'Daily Deposit' },
]

export function WithdrawalPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAccountNo, setSelectedAccountNo] = useState<string>('')
  const [savingsType, setSavingsType] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [ledger, setLedger] = useState<Transaction[]>([])
  const [loadingLedger, setLoadingLedger] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [accountId, setAccountId] = useState<number | null>(null)
  const [dailySavingsId, setDailySavingsId] = useState<number | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      date: '',
      amount: '',
      narration: '',
      receiverName: '',
    },
  })

  useEffect(() => {
    bankaccountApi.getActiveBankAccounts().then((list) => setAccounts(Array.isArray(list) ? list : [])).finally(() => setLoading(false))
  }, [])

  const handleGetDetails = async () => {
    if (!selectedAccountNo || !savingsType) return
    setLoadingLedger(true)
    setLedger([])
    try {
      const account = await bankaccountApi.getAccountByNumber({ sAccountNo: selectedAccountNo })
      const nAccountId = account?.nAccountId ?? null
      setAccountId(nAccountId)
      let nId: number | null = nAccountId
      if (savingsType === 'Daily Deposit') {
        const list = await savingstypeApi.savingstypeList({ sAccountNo: selectedAccountNo })
        const daily = Array.isArray(list) ? list.find((s: SavingTypeDetail) => (s.sTypeofSavings ?? '').toLowerCase().includes('daily')) : null
        const dsId = daily?.nSavingsId ?? null
        setDailySavingsId(dsId)
        nId = dsId
      } else {
        setDailySavingsId(null)
      }
      const end = new Date()
      const start = new Date(end)
      start.setFullYear(start.getFullYear() - 1)
      const from = toApiDate(start.toISOString().slice(0, 10))
      const to = toApiDate(end.toISOString().slice(0, 10))
      const tx = await transactionApi.getTransactionsBetweenDates({ from_date: from, to_date: to })
      const list = Array.isArray(tx) ? tx : []
      setLedger(list.filter((t) => t.sAccountNo === selectedAccountNo && t.nLoanId === nId))
      setShowForm(true)
    } finally {
      setLoadingLedger(false)
    }
  }

  const onSubmit = async (values: FormValues) => {
    if (!values.date || !values.amount || !values.narration || !values.receiverName) return
    const amount = Number(values.amount)
    if (Number.isNaN(amount) || amount <= 0) return
    setSubmitting(true)
    try {
      if (savingsType === 'Daily Deposit' && dailySavingsId != null) {
        const res = await dailysavingdepositApi.withdrawDailyDeposit({
          sAccountNo: selectedAccountNo,
          nAccountId: dailySavingsId,
          nAmount: amount,
          sEndDate: toApiDate(values.date),
          sNarration: values.narration,
          sReceiverName: values.receiverName,
        })
        const id = res?.id ?? '–'
        if (res?.status === 'A-Pending') alert(`A transaction is pending approval. Id: ${id}`)
        else alert(`Amount withdrawn successfully. Transaction id "${id}" needs to be approved.`)
      } else if (savingsType === 'Savings Account' && accountId != null) {
        const res = await dailysavingdepositApi.withdrawSavingsAccount({
          sAccountNo: selectedAccountNo,
          nAccountId: accountId,
          nAmount: amount,
          sStartDate: toApiDate(values.date),
          sNarration: values.narration,
          sReceiverName: values.receiverName,
        })
        const id = res?.id ?? '–'
        if (res?.status === 'A-Pending') alert(`A transaction is pending approval. Id: ${id}`)
        else alert(`Amount withdrawn successfully. Transaction id "${id}" needs to be approved.`)
      } else {
        alert('Please select account and type, then click Get SavingType Details first.')
      }
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? 'Withdrawal failed'
      alert(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClear = () => {
    reset()
  }

  const canGetDetails = Boolean(selectedAccountNo && savingsType)

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        Savings Account Withdrawal
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select an account and type of savings, then enter withdrawal details.
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Select Account
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  label="Account"
                  value={selectedAccountNo}
                  onChange={(e) => {
                    setSelectedAccountNo(e.target.value)
                    setSavingsType('')
                    setShowForm(false)
                  }}
                  disabled={loading}
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
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Select Type of Savings
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  label="Type of Savings"
                  value={savingsType}
                  onChange={(e) => {
                    setSavingsType(e.target.value)
                    setShowForm(false)
                  }}
                  disabled={!selectedAccountNo}
                >
                  <MenuItem value="">Select type</MenuItem>
                  {SAVINGS_TYPE_OPTIONS.map((t) => (
                    <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  type="button"
                  variant="contained"
                  size="medium"
                  onClick={handleGetDetails}
                  disabled={!canGetDetails}
                >
                  Get SavingType Details
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {showForm && (
          <>
            <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {savingsType} – Ledger
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Credit</TableCell>
                      <TableCell align="right">Debit</TableCell>
                      <TableCell align="right">Balance</TableCell>
                      <TableCell>Narration</TableCell>
                      <TableCell>Employee</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingLedger && (
                      <TableRow>
                        <TableCell colSpan={6}><CircularProgress size={24} /></TableCell>
                      </TableRow>
                    )}
                    {!loadingLedger && ledger.map((t) => (
                      <TableRow key={t.nTransactionId ?? t._id}>
                        <TableCell>{t.sDate ?? '–'}</TableCell>
                        <TableCell align="right">{t.nCreditAmount ? Number(t.nCreditAmount).toLocaleString() : '–'}</TableCell>
                        <TableCell align="right">{t.nDebitAmount ? Number(t.nDebitAmount).toLocaleString() : '–'}</TableCell>
                        <TableCell align="right">{(t.nBalanceAmount != null) ? Number(t.nBalanceAmount).toLocaleString() : '–'}</TableCell>
                        <TableCell>{t.sNarration ?? '–'}</TableCell>
                        <TableCell>{t.sEmployeeName ?? '–'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box sx={{ mt: 2 }}>
                  <Button type="button" variant="outlined" size="small" onClick={() => window.print()}>
                    Print
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Withdrawal – Transaction
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="date"
                      control={control}
                      rules={{ required: 'Date is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          size="small"
                          fullWidth
                          label="Date"
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.date)}
                          helperText={errors.date?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="amount"
                      control={control}
                      rules={{
                        required: 'Amount is required',
                        validate: (v) => {
                          const n = Number(v)
                          if (Number.isNaN(n) || n <= 0) return 'Amount must be greater than 0'
                          return true
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          size="small"
                          fullWidth
                          label="Total Amount"
                          inputProps={{ min: 0, step: 0.01 }}
                          error={Boolean(errors.amount)}
                          helperText={errors.amount?.message}
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
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Submitting…' : 'Withdraw & Send SMS'}
                      </Button>
                      <Button type="button" variant="outlined" onClick={handleClear}>
                        Clear
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </div>
  )
}
