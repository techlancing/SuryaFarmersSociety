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
import { useState, useEffect } from 'react'
import * as bankaccountApi from '../api/services/bankaccount'
import * as creditloanApi from '../api/services/creditloan'
import * as savingstypeApi from '../api/services/savingstype'
import type { BankAccount } from '../api/services/bankaccount'
import type { CreditLoanDetail } from '../api/services/creditloan'
import type { SavingTypeDetail } from '../api/services/savingstype'
import type { ApiError } from '../api/client'

export function AccountClosingPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [selectedAccountNo, setSelectedAccountNo] = useState<string>('')
  const [loans, setLoans] = useState<CreditLoanDetail[]>([])
  const [savingTypes, setSavingTypes] = useState<SavingTypeDetail[]>([])
  const [showData, setShowData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [closedLoanIds, setClosedLoanIds] = useState<Set<number>>(new Set())
  const [closedSavingIds, setClosedSavingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    bankaccountApi.getActiveBankAccounts().then((list) => setAccounts(Array.isArray(list) ? list : [])).catch(() => setAccounts([]))
  }, [])

  const loadAccountData = async () => {
    if (!selectedAccountNo) return
    setError(null)
    setLoading(true)
    try {
      const [loanList, savingList] = await Promise.all([
        creditloanApi.getallcreditloansByApproval({ sAccountNo: selectedAccountNo }),
        savingstypeApi.getallsavingstypeByApproval({ sAccountNo: selectedAccountNo }),
      ])
      setLoans(Array.isArray(loanList) ? loanList : [])
      setSavingTypes(Array.isArray(savingList) ? savingList : [])
      setShowData(true)
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to load account')
      setLoans([])
      setSavingTypes([])
    } finally {
      setLoading(false)
    }
  }

  const handleShow = () => {
    if (!selectedAccountNo) return
    setClosedLoanIds(new Set())
    setClosedSavingIds(new Set())
    loadAccountData()
  }

  const getLoanBalance = (loan: CreditLoanDetail): number => {
    const info = loan.oTransactionInfo ?? []
    if (info.length === 0) return 0
    const last = info[info.length - 1] as { nBalanceAmount?: number }
    return Number(last?.nBalanceAmount ?? 0)
  }

  const handleCloseLoan = async (loan: CreditLoanDetail) => {
    if (!selectedAccountNo || loan.nLoanId == null) return
    const msg = `Do you want to close "${loan.sTypeofLoan}"? Balance must be zero. This action cannot be reverted.`
    if (!window.confirm(msg)) return
    try {
      const result = await creditloanApi.deactivateCreditLoan({ sAccountNo: selectedAccountNo, nLoanId: loan.nLoanId })
      if (result === 'Success') {
        setClosedLoanIds((prev) => new Set(prev).add(loan.nLoanId!))
        setLoans((prev) => prev.filter((l) => l.nLoanId !== loan.nLoanId))
      } else {
        setError(result === 'Pending' ? 'Outstanding balance must be zero before closing.' : String(result))
      }
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to close loan')
    }
  }

  const handleCloseSavingType = async (st: SavingTypeDetail) => {
    if (!selectedAccountNo || st.nSavingsId == null) return
    const msg = `Do you want to close "${st.sTypeofSavings}"? This action cannot be reverted.`
    if (!window.confirm(msg)) return
    try {
      const result = await savingstypeApi.deactivateSavingType({
        sAccountNo: selectedAccountNo,
        nSavingsId: st.nSavingsId,
        sIsApproved: 'Approved',
      })
      if (result === 'Success') {
        setClosedSavingIds((prev) => new Set(prev).add(st.nSavingsId!))
        setSavingTypes((prev) => prev.filter((s) => s.nSavingsId !== st.nSavingsId))
      } else {
        setError(result === 'Pending' ? 'Balance must be zero before closing.' : String(result))
      }
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to close saving type')
    }
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>Account Closing</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select an account to view and close loans or saving types. Ensure balances are settled before closing.
      </Typography>
      {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
      <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Account</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField select size="small" label="Account Number" value={selectedAccountNo}
              onChange={(e) => { setSelectedAccountNo(e.target.value); setShowData(false) }} sx={{ minWidth: 280 }}>
              <MenuItem value="">Select account</MenuItem>
              {accounts.map((a) => (
                <MenuItem key={a._id ?? a.sAccountNo} value={a.sAccountNo ?? ''}>{a.sAccountNo} – {a.sApplicantName ?? '–'}</MenuItem>
              ))}
            </TextField>
            <Button type="button" variant="contained" onClick={handleShow} disabled={!selectedAccountNo || loading}>
              {loading ? <CircularProgress size={24} /> : 'Show Account'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {showData && selectedAccountNo && (
        <>
          <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Loans – Close when balance is zero</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Loan Name</TableCell>
                    <TableCell align="right">Sanction Amount</TableCell>
                    <TableCell align="right">Outstanding</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loans.map((loan) => {
                    const balance = getLoanBalance(loan)
                    const isClosed = closedLoanIds.has(loan.nLoanId!)
                    return (
                      <TableRow key={loan.nLoanId}>
                        <TableCell>{loan.sTypeofLoan}</TableCell>
                        <TableCell align="right">{(loan.nSanctionAmount ?? 0).toLocaleString()}</TableCell>
                        <TableCell align="right">{balance.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="outlined" color="error" disabled={isClosed} onClick={() => handleCloseLoan(loan)}>
                            {isClosed ? 'Closed' : 'Close'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Saving Types – Close when matured/withdrawn</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Saving Type</TableCell>
                    <TableCell align="right">Maturity Amount</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {savingTypes.map((st) => {
                    const isClosed = closedSavingIds.has(st.nSavingsId!)
                    return (
                      <TableRow key={st.nSavingsId}>
                        <TableCell>{st.sTypeofSavings}</TableCell>
                        <TableCell align="right">{(st.nMaturityAmount ?? 0).toLocaleString()}</TableCell>
                        <TableCell align="right">{(st.nDepositAmount ?? 0).toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="outlined" color="error" disabled={isClosed} onClick={() => handleCloseSavingType(st)}>
                            {isClosed ? 'Closed' : 'Close'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
