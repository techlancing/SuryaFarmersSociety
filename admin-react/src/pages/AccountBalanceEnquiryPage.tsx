import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { useState, useEffect } from 'react'
import * as bankaccountApi from '../api/services/bankaccount'
import * as savingstypeApi from '../api/services/savingstype'
import * as creditloanApi from '../api/services/creditloan'
import type { BankAccount } from '../api/services/bankaccount'
import type { ApiError } from '../api/client'

export function AccountBalanceEnquiryPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [selectedAccountNo, setSelectedAccountNo] = useState<string>('')
  const [showBalance, setShowBalance] = useState(false)
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [loadingBalance, setLoadingBalance] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [savingsBalance, setSavingsBalance] = useState<number | null>(null)
  const [loans, setLoans] = useState<{ sLoanName: string; nLoanBalance: number }[]>([])
  const [savingTypes, setSavingTypes] = useState<{ sSavingsName: string; nSavingsBalance: number }[]>([])

  useEffect(() => {
    let cancelled = false
    setLoadingAccounts(true)
    bankaccountApi
      .getActiveBankAccounts()
      .then((list) => {
        if (!cancelled) setAccounts(Array.isArray(list) ? list : [])
      })
      .catch(() => {
        if (!cancelled) setAccounts([])
      })
      .finally(() => {
        if (!cancelled) setLoadingAccounts(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleShowBalance = async () => {
    if (!selectedAccountNo) return
    setError(null)
    setShowBalance(true)
    setLoadingBalance(true)
    try {
      const [balanceRes, savingsRes, loansRes] = await Promise.all([
        bankaccountApi.getSingleAccountBalance({ sAccountNo: selectedAccountNo }),
        savingstypeApi.getAccountSavingTypes({ sAccountNo: selectedAccountNo }).catch(() => []),
        creditloanApi.getAccountCreditLoans({ sAccountNo: selectedAccountNo }).catch(() => []),
      ])
      setSavingsBalance(
        typeof balanceRes === 'number' ? balanceRes : null
      )
      setSavingTypes(Array.isArray(savingsRes) ? savingsRes : [])
      setLoans(Array.isArray(loansRes) ? loansRes : [])
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to load balance')
      setSavingsBalance(null)
      setSavingTypes([])
      setLoans([])
    } finally {
      setLoadingBalance(false)
    }
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        Balance Enquiry
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select an account to view savings, loan and saving-type balances.
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Account
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              select
              size="small"
              label="Account Number"
              value={selectedAccountNo}
              onChange={(e) => {
                setSelectedAccountNo(e.target.value)
                setShowBalance(false)
              }}
              disabled={loadingAccounts}
              sx={{ minWidth: 280 }}
            >
              <MenuItem value="">Select account</MenuItem>
              {accounts.map((a) => (
                <MenuItem key={a._id ?? a.sAccountNo} value={a.sAccountNo ?? ''}>
                  {a.sAccountNo} – {a.sApplicantName ?? '–'}
                </MenuItem>
              ))}
            </TextField>
            <Button
              type="button"
              variant="contained"
              onClick={handleShowBalance}
              disabled={!selectedAccountNo || loadingBalance}
            >
              {loadingBalance ? <CircularProgress size={24} /> : 'Show Account Balance'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {showBalance && selectedAccountNo && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb', height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Savings Account
              </Typography>
              <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Balance
                </Typography>
                <Typography variant="h6">
                  ₹ {(savingsBalance ?? 0).toLocaleString()}/-
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb', height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Loan Account
              </Typography>
              <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 1 }}>
                {loans.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No loans</Typography>
                ) : (
                  loans.map((loan) => (
                    <Box key={loan.sLoanName} sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">{loan.sLoanName}</Typography>
                      <Typography variant="body1">₹ {loan.nLoanBalance.toLocaleString()}/-</Typography>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb', height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Saving Type
              </Typography>
              <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 1 }}>
                {savingTypes.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">None</Typography>
                ) : (
                  savingTypes.map((st) => (
                    <Box key={st.sSavingsName} sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">{st.sSavingsName}</Typography>
                      <Typography variant="body1">₹ {st.nSavingsBalance.toLocaleString()}/-</Typography>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </div>
  )
}
