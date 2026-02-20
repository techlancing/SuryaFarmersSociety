import {
  Box,
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
import { useMemo, useState, useEffect } from 'react'
import * as creditloanApi from '../api/services/creditloan'
import * as transactionApi from '../api/services/transaction'
import * as savingstypeApi from '../api/services/savingstype'
import type { CreditLoanDetail } from '../api/services/creditloan'
import type { Transaction } from '../api/services/transaction'
import type { SavingTypeDetail } from '../api/services/savingstype'

export function ApprovalDetailsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [savings, setSavings] = useState<SavingTypeDetail[]>([])
  const [loans, setLoans] = useState<CreditLoanDetail[]>([])
  const [credits, setCredits] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      savingstypeApi.needToApproveSavingstypeList(),
      creditloanApi.needToApproveGetallcreditloans(),
      transactionApi.getNeedToApproveTransactionList(),
    ]).then(([s, l, c]) => {
      if (!cancelled) {
        setSavings(Array.isArray(s) ? s : [])
        setLoans(Array.isArray(l) ? l : [])
        setCredits(Array.isArray(c) ? c : [])
      }
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const filterSavings = useMemo(() => {
    if (!searchTerm.trim()) return savings
    const t = searchTerm.toLowerCase()
    return savings.filter((r) => (r.sAccountNo ?? '').toLowerCase().includes(t) || (r.sTypeofSavings ?? '').toLowerCase().includes(t))
  }, [searchTerm, savings])

  const filterLoans = useMemo(() => {
    if (!searchTerm.trim()) return loans
    const t = searchTerm.toLowerCase()
    return loans.filter((r) => (r.sAccountNo ?? '').toLowerCase().includes(t) || (r.sTypeofLoan ?? '').toLowerCase().includes(t))
  }, [searchTerm, loans])

  const filterCredits = useMemo(() => {
    if (!searchTerm.trim()) return credits
    const t = searchTerm.toLowerCase()
    return credits.filter((r) => (r.sAccountNo ?? '').toLowerCase().includes(t) || (r.sAccountType ?? '').toLowerCase().includes(t))
  }, [searchTerm, credits])

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        Approval Status
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        View approval status for SavingType, CreditLoan and Credit/Debit transactions (pending approvals).
      </Typography>

      {loading && <Box sx={{ py: 2 }}><CircularProgress /></Box>}

      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by account no, name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 280 }}
        />
      </Box>

      <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Pending SavingType Approvals</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Account Number</TableCell>
                <TableCell>SavingDeposit Name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Maturity Date</TableCell>
                <TableCell align="right">Deposited Amount</TableCell>
                <TableCell align="right">Maturity Amount</TableCell>
                <TableCell>Approved Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterSavings.map((r, i) => (
                <TableRow key={r.nSavingsId ?? i}>
                  <TableCell>{r.sAccountNo ?? '–'}</TableCell>
                  <TableCell>{r.sTypeofSavings ?? '–'}</TableCell>
                  <TableCell>{r.sStartDate ?? '–'}</TableCell>
                  <TableCell>{r.sMaturityDate ?? '–'}</TableCell>
                  <TableCell align="right">{(r.nDepositAmount ?? 0).toLocaleString()}</TableCell>
                  <TableCell align="right">{(r.nMaturityAmount ?? 0).toLocaleString()}</TableCell>
                  <TableCell>{r.sIsApproved ?? '–'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Pending CreditLoan Approvals</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Account Number</TableCell>
                <TableCell>CreditLoan Name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell align="right">Sanction Amount</TableCell>
                <TableCell align="right">Total Amount</TableCell>
                <TableCell>Approved Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterLoans.map((r, i) => (
                <TableRow key={r.nLoanId ?? i}>
                  <TableCell>{r.sAccountNo ?? '–'}</TableCell>
                  <TableCell>{r.sTypeofLoan ?? '–'}</TableCell>
                  <TableCell>{r.sDate ?? '–'}</TableCell>
                  <TableCell align="right">{(r.nSanctionAmount ?? 0).toLocaleString()}</TableCell>
                  <TableCell align="right">{(r.nTotalAmount ?? 0).toLocaleString()}</TableCell>
                  <TableCell>{r.sIsApproved ?? '–'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Pending Credit/Debit Approvals</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Account Number</TableCell>
                <TableCell>Account Type</TableCell>
                <TableCell align="right">Credit</TableCell>
                <TableCell align="right">Debit</TableCell>
                <TableCell align="right">Balance</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Approved Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterCredits.map((r, i) => (
                <TableRow key={r.nTransactionId ?? i}>
                  <TableCell>{r.sAccountNo ?? '–'}</TableCell>
                  <TableCell>{r.sAccountType ?? '–'}</TableCell>
                  <TableCell align="right">{r.nCreditAmount ? Number(r.nCreditAmount).toLocaleString() : '–'}</TableCell>
                  <TableCell align="right">{r.nDebitAmount ? Number(r.nDebitAmount).toLocaleString() : '–'}</TableCell>
                  <TableCell align="right">{(r.nBalanceAmount != null) ? Number(r.nBalanceAmount).toLocaleString() : '–'}</TableCell>
                  <TableCell>{r.sDate ?? '–'}</TableCell>
                  <TableCell>{r.sIsApproved ?? '–'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
