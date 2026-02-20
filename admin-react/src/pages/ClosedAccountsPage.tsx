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
import type { Transaction } from '../api/services/transaction'
import type { CreditLoanDetail } from '../api/services/creditloan'
import type { SavingTypeDetail } from '../api/services/savingstype'
import type { ApiError } from '../api/client'

export function ClosedAccountsPage() {
  const [closedAccounts, setClosedAccounts] = useState<BankAccount[]>([])
  const [selectedAccountNo, setSelectedAccountNo] = useState<string>('')
  const [savingsTxns, setSavingsTxns] = useState<Transaction[]>([])
  const [loans, setLoans] = useState<CreditLoanDetail[]>([])
  const [savingTypes, setSavingTypes] = useState<SavingTypeDetail[]>([])
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    bankaccountApi.getAllBankAccounts().then((list) => {
      const all = Array.isArray(list) ? list : []
      setClosedAccounts(all.filter((a: BankAccount) => a.bIsDeactivated === true))
    }).catch(() => setClosedAccounts([]))
  }, [])

  const handleShow = async () => {
    if (!selectedAccountNo) return
    setError(null)
    setLoading(true)
    try {
      const account = await bankaccountApi.getAccountByNumber({ sAccountNo: selectedAccountNo }) as BankAccount
      const nAccountId = account?.nAccountId
      const [txns, loanList, savingList] = await Promise.all([
        nAccountId != null ? bankaccountApi.getAllSavingsTransactions({ nAccountId }) : [],
        creditloanApi.getclosedallcreditloans({ sAccountNo: selectedAccountNo }),
        savingstypeApi.getallclosedsavingstypeByApproval({ sAccountNo: selectedAccountNo }),
      ])
      setSavingsTxns(Array.isArray(txns) ? txns : [])
      setLoans(Array.isArray(loanList) ? loanList : [])
      setSavingTypes(Array.isArray(savingList) ? savingList : [])
      setShowDetails(true)
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to load closed account')
      setSavingsTxns([])
      setLoans([])
      setSavingTypes([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>View Closed Accounts</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select a closed account to view savings, loans and saving-type ledgers. Use Print to print the section.
      </Typography>
      {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
      <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Closed Account</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField select size="small" label="Account Number" value={selectedAccountNo}
              onChange={(e) => { setSelectedAccountNo(e.target.value); setShowDetails(false) }} sx={{ minWidth: 280 }}>
              <MenuItem value="">Select closed account</MenuItem>
              {closedAccounts.map((a) => (
                <MenuItem key={a._id ?? a.sAccountNo} value={a.sAccountNo ?? ''}>{a.sAccountNo} – {a.sApplicantName ?? '–'}</MenuItem>
              ))}
            </TextField>
            <Button type="button" variant="contained" onClick={handleShow} disabled={!selectedAccountNo || loading}>
              {loading ? <CircularProgress size={24} /> : 'Show'}
            </Button>
            <Button type="button" variant="outlined" disabled={!showDetails} onClick={() => window.print()}>Print</Button>
          </Box>
        </CardContent>
      </Card>

      {showDetails && selectedAccountNo && (
        <>
          <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }} className="closed-print-area">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">Savings Account</Typography>
                <Button size="small" variant="outlined" onClick={() => window.print()}>Print</Button>
              </Box>
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
                  {savingsTxns.map((t, i) => (
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
          {loans.map((loan) => (
            <Card key={loan.nLoanId ?? loan.sTypeofLoan} elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }} className="closed-print-area">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">{loan.sTypeofLoan} – {(loan.nSanctionAmount ?? 0).toLocaleString()}</Typography>
                  <Button size="small" variant="outlined" onClick={() => window.print()}>Print</Button>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Start Date: {loan.sDate ?? '–'}</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Credit</TableCell>
                      <TableCell align="right">Debit</TableCell>
                      <TableCell align="right">Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(loan.oTransactionInfo ?? []).map((t: { sDate?: string; nCreditAmount?: number; nDebitAmount?: number; nBalanceAmount?: number }, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{t.sDate ?? '–'}</TableCell>
                        <TableCell align="right">{t.nCreditAmount ? Number(t.nCreditAmount).toLocaleString() : '–'}</TableCell>
                        <TableCell align="right">{t.nDebitAmount ? Number(t.nDebitAmount).toLocaleString() : '–'}</TableCell>
                        <TableCell align="right">{t.nBalanceAmount != null ? Number(t.nBalanceAmount).toLocaleString() : '–'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  )
}
