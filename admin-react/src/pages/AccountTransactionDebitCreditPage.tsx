import {
  Box,
  Button,
  Card,
  CardContent,
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
import * as creditloanApi from '../api/services/creditloan'
import * as debitApi from '../api/services/debit'
import * as creditApi from '../api/services/credit'
import { toApiDate } from '../api/reportUtils'
import type { BankAccount } from '../api/services/bankaccount'
import type { CreditLoanDetail } from '../api/services/creditloan'

interface FormValues {
  date: string
  amount: string
  narration: string
  receiverName: string
}

interface AccountTransactionDebitCreditPageProps {
  mode: 'debit' | 'credit'
}

export function AccountTransactionDebitCreditPage({ mode }: AccountTransactionDebitCreditPageProps) {
  const isCredit = mode === 'credit'
  const caption = isCredit ? 'Loan Credit' : 'Loan Debit'
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAccountNo, setSelectedAccountNo] = useState<string>('')
  const [loans, setLoans] = useState<CreditLoanDetail[]>([])
  const [loadingLoans, setLoadingLoans] = useState(false)
  const [selectedLoanId, setSelectedLoanId] = useState<number | ''>('')
  const [showLoanData, setShowLoanData] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
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

  useEffect(() => {
    if (!selectedAccountNo) {
      setLoans([])
      setSelectedLoanId('')
      setShowLoanData(false)
      return
    }
    setLoadingLoans(true)
    creditloanApi.getallcreditloansByApproval({ sAccountNo: selectedAccountNo }).then((list) => {
      setLoans(Array.isArray(list) ? list : [])
      setSelectedLoanId('')
      setShowLoanData(false)
    }).finally(() => setLoadingLoans(false))
  }, [selectedAccountNo])

  const selectedLoan = useMemo(
    () => loans.find((l) => l.nLoanId === selectedLoanId) ?? null,
    [loans, selectedLoanId],
  )

  const handleGetLoanDetails = () => {
    if (selectedLoanId === '') return
    const loan = loans.find((l) => l.nLoanId === selectedLoanId)
    if (loan) {
      setShowLoanData(true)
      const inst = (loan as CreditLoanDetail & { nInstallmentAmount?: number }).nInstallmentAmount
      const penalty = (loan as CreditLoanDetail & { nLetPenaltyPercentage?: number }).nLetPenaltyPercentage
      const instNum = Number(inst) || 0
      const penaltyNum = Number(penalty) || 0
      if (isCredit && instNum) {
        const amountWithPenalty = Math.round((instNum + (instNum * penaltyNum / 100)) * 100) / 100
        setValue('amount', String(amountWithPenalty))
      } else if (instNum) {
        setValue('amount', String(instNum))
      }
    }
  }

  const onSubmit = async (values: FormValues) => {
    if (!selectedAccountNo) {
      alert('Please select an account first.')
      return
    }
    if (selectedLoanId === '' || !selectedLoan) {
      alert('Please select a loan and click Get Loan Details.')
      return
    }
    if (!values.date || !values.amount || !values.narration || !values.receiverName) {
      alert('Please fill all the fields.')
      return
    }
    const amount = Number(values.amount)
    if (Number.isNaN(amount) || amount <= 0) {
      alert('Amount must be a positive number.')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        sAccountNo: selectedAccountNo,
        nLoanId: selectedLoanId as number,
        nAmount: amount,
        sDate: toApiDate(values.date),
        sNarration: values.narration,
        sReceiverName: values.receiverName,
      }
      if (isCredit) {
        const res = await creditApi.addCredit(payload)
        const id = res?.id ?? '–'
        if (res?.status === 'A-Pending') alert(`A transaction is pending approval. Id: ${id}`)
        else alert(`Amount credited successfully. Transaction id "${id}" needs to be approved.`)
      } else {
        const res = await debitApi.addDebit(payload)
        const id = res?.id ?? '–'
        if (res?.status === 'A-Pending') alert(`A transaction is pending approval. Id: ${id}`)
        else if (res?.status === 'low') alert('Outstanding balance is low.')
        else alert(`Amount debited successfully. Transaction id "${id}" needs to be approved.`)
      }
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? 'Submit failed'
      alert(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClear = () => {
    reset()
    setValue('amount', '')
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        {caption}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select an account, then choose a loan to record a {isCredit ? 'credit' : 'debit'} transaction.
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Select Account
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ minWidth: 200, flex: '1 1 40%' }}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  label="Account"
                  value={selectedAccountNo}
                  onChange={(e) => {
                    setSelectedAccountNo(e.target.value)
                    setSelectedLoanId('')
                    setShowLoanData(false)
                    setValue('amount', '')
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
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Select Loan
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Box sx={{ minWidth: 200, flex: '1 1 40%' }}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  label="Select Loan"
                  value={selectedLoanId}
                  onChange={(e) => {
                    setSelectedLoanId(e.target.value ? Number(e.target.value) : '')
                    setShowLoanData(false)
                    setValue('amount', '')
                  }}
                  disabled={!selectedAccountNo || loadingLoans}
                >
                  <MenuItem value="">Select loan</MenuItem>
                  {loans.map((loan) => (
                    <MenuItem key={loan.nLoanId} value={loan.nLoanId ?? 0}>
                      {loan.sTypeofLoan} – {loan.nSanctionAmount ?? 0}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box>
                <Button
                  type="button"
                  variant="contained"
                  size="medium"
                  onClick={handleGetLoanDetails}
                  disabled={!selectedLoanId}
                >
                  Get Loan Details
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {showLoanData && selectedLoan && (
          <>
            <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedLoan.sTypeofLoan} – {selectedLoan.nSanctionAmount ?? 0}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="caption" color="text.secondary">Loan Issue Date</Typography>
                    <Typography variant="body2">{selectedLoan.sDate ?? '–'}</Typography>
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="caption" color="text.secondary">Type of Loan</Typography>
                    <Typography variant="body2">{selectedLoan.sTypeofLoan ?? '–'}</Typography>
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="caption" color="text.secondary">Sanction Amount</Typography>
                    <Typography variant="body2">{selectedLoan.nSanctionAmount ?? '–'}</Typography>
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="caption" color="text.secondary">Total Amount</Typography>
                    <Typography variant="body2">{selectedLoan.nTotalAmount ?? '–'}</Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Loan Transactions
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
                    {(selectedLoan.oTransactionInfo ?? []).map((t: { nTransactionId?: number; sDate?: string; nCreditAmount?: number; nDebitAmount?: number; nBalanceAmount?: number; sNarration?: string; sEmployeeName?: string }) => (
                      <TableRow key={t.nTransactionId}>
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
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {caption} – Transaction
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ minWidth: 200, flex: '1 1 40%' }}>
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
                  </Box>
                  <Box sx={{ minWidth: 200, flex: '1 1 40%' }}>
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
                  </Box>
                  <Box sx={{ minWidth: 200, flex: '1 1 40%' }}>
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
                  </Box>
                  <Box sx={{ minWidth: 200, flex: '1 1 40%' }}>
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
                  </Box>
                  <Box sx={{ flex: '1 1 100%', mt: 1 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Submitting…' : 'Send SMS & Save & Submit'}
                      </Button>
                      <Button type="button" variant="outlined" onClick={handleClear}>
                        Clear
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </div>
  )
}
