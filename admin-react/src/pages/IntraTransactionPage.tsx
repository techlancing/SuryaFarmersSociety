import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useState, useEffect, useMemo } from 'react'
import * as bankaccountApi from '../api/services/bankaccount'
import * as savingstypeApi from '../api/services/savingstype'
import * as creditloanApi from '../api/services/creditloan'
import * as intratransactionApi from '../api/services/intratransaction'
import * as transactionApi from '../api/services/transaction'
import { toApiDate } from '../api/reportUtils'
import type { BankAccount } from '../api/services/bankaccount'
import type { SavingTypeDetail } from '../api/services/savingstype'
import type { CreditLoanDetail } from '../api/services/creditloan'

interface FormValues {
  date: string
  amount: string
  narration: string
  transactionEmployee: string
  receiverAccountType: string
  receiverLoanId: string
  receiverSavingTypeId: string
}

export function IntraTransactionPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [senderAccountNo, setSenderAccountNo] = useState<string>('')
  const [senderSavingsType, setSenderSavingsType] = useState<string>('')
  const [senderAccountId, setSenderAccountId] = useState<number | null>(null)
  const [senderBalance, setSenderBalance] = useState<number | null>(null)
  const [showBalance, setShowBalance] = useState(false)
  const [receiverAccountNo, setReceiverAccountNo] = useState<string>('')
  const [receiverAccountId, setReceiverAccountId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [receiverLoans, setReceiverLoans] = useState<CreditLoanDetail[]>([])
  const [receiverSavingTypes, setReceiverSavingTypes] = useState<SavingTypeDetail[]>([])
  const [submitting, setSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      date: '',
      amount: '',
      narration: '',
      transactionEmployee: '',
      receiverAccountType: 'savings',
      receiverLoanId: '',
      receiverSavingTypeId: '',
    },
  })

  const receiverAccountType = watch('receiverAccountType')

  useEffect(() => {
    bankaccountApi.getActiveBankAccounts().then((list) => setAccounts(Array.isArray(list) ? list : [])).finally(() => setLoading(false))
  }, [])

  const senderSavingsTypeOptions = [
    { value: 'Savings Account', label: 'Savings Account' },
    { value: 'Daily Deposit', label: 'Daily Deposit' },
  ]

  const handleGetBalance = async () => {
    if (!senderAccountNo || !senderSavingsType) return
    try {
      const account = await bankaccountApi.getAccountByNumber({ sAccountNo: senderAccountNo })
      const nAccountId = account?.nAccountId ?? null
      if (senderSavingsType === 'Savings Account') {
        setSenderAccountId(nAccountId)
        if (nAccountId != null) {
          const end = new Date()
          const start = new Date(end)
          start.setFullYear(start.getFullYear() - 1)
          const from = toApiDate(start.toISOString().slice(0, 10))
          const to = toApiDate(end.toISOString().slice(0, 10))
          const tx = await transactionApi.getTransactionsBetweenDates({ from_date: from, to_date: to })
          const list = Array.isArray(tx) ? tx : []
          const last = list.filter((t) => t.sAccountNo === senderAccountNo && t.nLoanId === nAccountId).pop()
          setSenderBalance(last?.nBalanceAmount != null ? Number(last.nBalanceAmount) : 0)
        } else setSenderBalance(null)
      } else {
        const list = await savingstypeApi.savingstypeList({ sAccountNo: senderAccountNo })
        const daily = Array.isArray(list) ? list.find((s) => (s.sTypeofSavings ?? '').toLowerCase().includes('daily')) : null
        const nId = daily?.nSavingsId ?? null
        setSenderAccountId(nId)
        if (nId != null) {
          const end = new Date()
          const start = new Date(end)
          start.setFullYear(start.getFullYear() - 1)
          const from = toApiDate(start.toISOString().slice(0, 10))
          const to = toApiDate(end.toISOString().slice(0, 10))
          const tx = await transactionApi.getTransactionsBetweenDates({ from_date: from, to_date: to })
          const list = Array.isArray(tx) ? tx : []
          const last = list.filter((t) => t.sAccountNo === senderAccountNo && t.nLoanId === nId).pop()
          setSenderBalance(last?.nBalanceAmount != null ? Number(last.nBalanceAmount) : 0)
        } else setSenderBalance(null)
      }
      setShowBalance(true)
    } catch {
      setSenderBalance(null)
      setShowBalance(true)
    }
  }

  const handleSelectReceiver = async (accountNo: string) => {
    setReceiverAccountNo(accountNo)
    setShowForm(true)
    setValue('narration', `From Acc No: ${senderAccountNo}   To Acc No: ${accountNo}`)
    try {
      const account = await bankaccountApi.getAccountByNumber({ sAccountNo: accountNo })
      setReceiverAccountId(account?.nAccountId ?? null)
      const [loans, savingTypes] = await Promise.all([
        creditloanApi.getallcreditloansByApproval({ sAccountNo: accountNo }),
        savingstypeApi.savingstypeList({ sAccountNo: accountNo }),
      ])
      setReceiverLoans(Array.isArray(loans) ? loans : [])
      setReceiverSavingTypes(Array.isArray(savingTypes) ? savingTypes : [])
    } catch {
      setReceiverLoans([])
      setReceiverSavingTypes([])
      setReceiverAccountId(null)
    }
  }

  const onSubmit = async (values: FormValues) => {
    if (!senderAccountNo || !receiverAccountNo) {
      alert('Please select sender and receiver accounts.')
      return
    }
    if (!values.date || !values.amount || !values.narration || !values.transactionEmployee) {
      alert('Please fill all required fields.')
      return
    }
    const amount = Number(values.amount)
    if (Number.isNaN(amount) || amount <= 0) {
      alert('Amount must be a positive number.')
      return
    }
    let nReceiverId: number | null = receiverAccountId
    let sReceiverType: 'savings' | 'loan' | 'savingtype' = 'savings'
    if (receiverAccountType === 'loan' && values.receiverLoanId) {
      nReceiverId = Number(values.receiverLoanId)
      sReceiverType = 'loan'
    } else if (receiverAccountType === 'savingtype' && values.receiverSavingTypeId) {
      nReceiverId = Number(values.receiverSavingTypeId)
      sReceiverType = 'savingtype'
    }
    if (nReceiverId == null) {
      alert('Please select receiver account type and option.')
      return
    }
    const senderType: 'savings' | 'savingtype' = senderSavingsType === 'Savings Account' ? 'savings' : 'savingtype'
    const nSenderId = senderAccountId
    if (nSenderId == null) {
      alert('Sender account type not resolved.')
      return
    }
    setSubmitting(true)
    try {
      const payload: intratransactionApi.IntraAccountTransactionPayload = {
        sSenderAccountNumber: senderAccountNo,
        nSenderAccountId: nSenderId,
        sSenderAccountType: senderType,
        sRecieverAccountNumber: receiverAccountNo,
        nReceiverAccountId: nReceiverId,
        sRecieverAccountType: sReceiverType,
        nAmount: amount,
        sDate: toApiDate(values.date),
        sNarration: values.narration,
        sTransactionEmployee: values.transactionEmployee,
      }
      if (sReceiverType === 'savingtype') payload.nLoanId = nReceiverId
      const res = await intratransactionApi.intraaccounttransaction(payload)
      const id = res?.id ?? '–'
      if (res?.status === 'A-S-Pending' || res?.status === 'A-R-Pending') {
        alert(`A transaction is pending approval. Id: ${id}`)
      } else if (res?.status === 'low') {
        alert('Sender account balance is low.')
      } else {
        alert(`Transaction saved successfully. Transaction id "${id}" needs to be approved.`)
      }
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? 'Submit failed'
      alert(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClear = () => {
    setSenderAccountNo('')
    setSenderSavingsType('')
    setShowBalance(false)
    setSenderAccountId(null)
    setSenderBalance(null)
    setReceiverAccountNo('')
    setReceiverAccountId(null)
    setShowForm(false)
    setReceiverLoans([])
    setReceiverSavingTypes([])
    reset()
  }

  const otherAccounts = useMemo(() => accounts.filter((a) => a.sAccountNo !== senderAccountNo), [accounts, senderAccountNo])

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        Intra Transaction
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select sender account and get balance, then select receiver account and enter transaction details.
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Sender Account
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  label="Sender Account"
                  value={senderAccountNo}
                  onChange={(e) => {
                    setSenderAccountNo(e.target.value)
                    setSenderSavingsType('')
                    setShowBalance(false)
                    setSenderAccountId(null)
                    setSenderBalance(null)
                    setReceiverAccountNo('')
                    setReceiverAccountId(null)
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

        {senderAccountNo && (
          <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Select Type of Savings (Sender)
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    label="Type of Savings"
                    value={senderSavingsType}
                    onChange={(e) => {
                      setSenderSavingsType(e.target.value)
                      setShowBalance(false)
                    }}
                  >
                    <MenuItem value="">Select type</MenuItem>
                    {senderSavingsTypeOptions.map((t) => (
                      <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    type="button"
                    variant="contained"
                    size="medium"
                    onClick={handleGetBalance}
                    disabled={!senderSavingsType}
                  >
                    Select & Get Balance
                  </Button>
                </Grid>
                {showBalance && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      {senderSavingsType} – Balance: <strong>₹{(senderBalance ?? 0).toLocaleString()}</strong>
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        )}

        {showBalance && (
          <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Receiver Account
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    label="Receiver Account"
                    value={receiverAccountNo}
                    onChange={(e) => {
                      const v = e.target.value
                      if (v) handleSelectReceiver(v)
                    }}
                  >
                    <MenuItem value="">Select account</MenuItem>
                    {otherAccounts.map((a) => (
                      <MenuItem key={a.sAccountNo} value={a.sAccountNo ?? ''}>
                        {a.sAccountNo} – {a.sApplicantName ?? a.sApplicantSurName ?? '–'}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {showForm && receiverAccountNo && (
          <>
            <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Receiver Account Type
                </Typography>
                <Controller
                  name="receiverAccountType"
                  control={control}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup row {...field}>
                        <FormControlLabel value="savings" control={<Radio />} label="Savings" />
                        <FormControlLabel value="loan" control={<Radio />} label="Loan" />
                        <FormControlLabel value="savingtype" control={<Radio />} label="Saving Type" />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </CardContent>
            </Card>

            {receiverAccountType === 'loan' && (
              <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Select Loan
                  </Typography>
                  <Controller
                    name="receiverLoanId"
                    control={control}
                    rules={receiverAccountType === 'loan' ? { required: 'Select a loan' } : {}}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        size="small"
                        fullWidth
                        label="Select Loan"
                        error={Boolean(errors.receiverLoanId)}
                        helperText={errors.receiverLoanId?.message}
                      >
                        <MenuItem value="">Select loan</MenuItem>
                        {receiverLoans.map((l) => (
                          <MenuItem key={l.nLoanId} value={String(l.nLoanId ?? 0)}>{l.sTypeofLoan}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {receiverAccountType === 'savingtype' && (
              <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Select Saving Type
                  </Typography>
                  <Controller
                    name="receiverSavingTypeId"
                    control={control}
                    rules={receiverAccountType === 'savingtype' ? { required: 'Select a saving type' } : {}}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        size="small"
                        fullWidth
                        label="Select Saving Type"
                        error={Boolean(errors.receiverSavingTypeId)}
                        helperText={errors.receiverSavingTypeId?.message}
                      >
                        <MenuItem value="">Select type</MenuItem>
                        {receiverSavingTypes.map((s) => (
                          <MenuItem key={s.nSavingsId} value={String(s.nSavingsId ?? 0)}>{s.sTypeofSavings}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Intra Transaction
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Sender Account Number"
                      value={senderAccountNo}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Receiver Account Number"
                      value={receiverAccountNo}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
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
                          label="Amount"
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
                      name="transactionEmployee"
                      control={control}
                      rules={{ required: 'Transaction employee is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          fullWidth
                          label="Transaction Employee"
                          error={Boolean(errors.transactionEmployee)}
                          helperText={errors.transactionEmployee?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Submitting…' : 'Send SMS & Save & Submit'}
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
