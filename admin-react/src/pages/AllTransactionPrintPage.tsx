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
import type { BankAccount } from '../api/services/bankaccount'
import type { Transaction } from '../api/services/transaction'
import type { CreditLoanDetail } from '../api/services/creditloan'
import type { ApiError } from '../api/client'

export function AllTransactionPrintPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [selectedAccountNo, setSelectedAccountNo] = useState<string>('')
  const [savingsTxns, setSavingsTxns] = useState<Transaction[]>([])
  const [loans, setLoans] = useState<CreditLoanDetail[]>([])
  const [showData, setShowData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    bankaccountApi.getActiveBankAccounts().then((list) => setAccounts(Array.isArray(list) ? list : [])).catch(() => setAccounts([]))
  }, [])

  const handleShow = async () => {
    if (!selectedAccountNo) return
    setError(null)
    setLoading(true)
    try {
      const account = await bankaccountApi.getAccountByNumber({ sAccountNo: selectedAccountNo }) as BankAccount
      const nAccountId = account?.nAccountId
      const [txns, loanList] = await Promise.all([
        nAccountId != null ? bankaccountApi.getAllSavingsTransactions({ nAccountId }) : [],
        creditloanApi.getallcreditloansByApproval({ sAccountNo: selectedAccountNo }),
      ])
      setSavingsTxns(Array.isArray(txns) ? txns : [])
      setLoans(Array.isArray(loanList) ? loanList : [])
      setShowData(true)
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to load transactions')
      setSavingsTxns([])
      setLoans([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>All Transaction Print</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select an account to view savings and loan transactions. Use Print to print the section.
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
              {loading ? <CircularProgress size={24} /> : 'Show Transactions'}
            </Button>
            <Button type="button" variant="outlined" disabled={!showData} onClick={() => window.print()}>Print</Button>
          </Box>
        </CardContent>
      </Card>

      {showData && selectedAccountNo && (
        <>
          <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }} className="print-area">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Savings Account</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Account No</TableCell>
                    <TableCell align="right">Credit</TableCell>
                    <TableCell align="right">Debit</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell>Txn ID</TableCell>
                    <TableCell>Narration</TableCell>
                    <TableCell>Employee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {savingsTxns.map((t, i) => (
                    <TableRow key={t._id ?? i}>
                      <TableCell>{t.sDate ?? '–'}</TableCell>
                      <TableCell>{t.sAccountNo ?? '–'}</TableCell>
                      <TableCell align="right">{t.nCreditAmount ? Number(t.nCreditAmount).toLocaleString() : '–'}</TableCell>
                      <TableCell align="right">{t.nDebitAmount ? Number(t.nDebitAmount).toLocaleString() : '–'}</TableCell>
                      <TableCell align="right">{t.nBalanceAmount != null ? Number(t.nBalanceAmount).toLocaleString() : '–'}</TableCell>
                      <TableCell>{t.nTransactionId ?? '–'}</TableCell>
                      <TableCell>{t.sNarration ?? '–'}</TableCell>
                      <TableCell>{t.sEmployeeName ?? '–'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {loans.map((loan) => (
            <Card key={loan.nLoanId ?? loan.sTypeofLoan} elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }} className="print-area">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>{loan.sTypeofLoan} – {(loan.nSanctionAmount ?? 0).toLocaleString()}</Typography>
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
                    {(loan.oTransactionInfo ?? []).map((t: { sDate?: string; nCreditAmount?: number; nDebitAmount?: number; nBalanceAmount?: number; sNarration?: string; sEmployeeName?: string }, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{t.sDate ?? '–'}</TableCell>
                        <TableCell align="right">{t.nCreditAmount ? Number(t.nCreditAmount).toLocaleString() : '–'}</TableCell>
                        <TableCell align="right">{t.nDebitAmount ? Number(t.nDebitAmount).toLocaleString() : '–'}</TableCell>
                        <TableCell align="right">{t.nBalanceAmount != null ? Number(t.nBalanceAmount).toLocaleString() : '–'}</TableCell>
                        <TableCell>{t.sNarration ?? '–'}</TableCell>
                        <TableCell>{t.sEmployeeName ?? '–'}</TableCell>
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
