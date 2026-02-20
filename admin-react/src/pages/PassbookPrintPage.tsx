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
import type { BankAccount } from '../api/services/bankaccount'
import type { Transaction } from '../api/services/transaction'
import type { ApiError } from '../api/client'

export function PassbookPrintPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [selectedAccountNo, setSelectedAccountNo] = useState<string>('')
  const [accountDetails, setAccountDetails] = useState<BankAccount | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    bankaccountApi.getActiveBankAccounts().then((list) => setAccounts(Array.isArray(list) ? list : [])).catch(() => setAccounts([])).finally(() => setLoadingAccounts(false))
  }, [])

  const handleShowDetails = async () => {
    if (!selectedAccountNo) return
    setError(null)
    setLoading(true)
    try {
      const account = await bankaccountApi.getAccountByNumber({ sAccountNo: selectedAccountNo }) as BankAccount
      setAccountDetails(account)
      const nAccountId = account?.nAccountId
      const txns = nAccountId != null
        ? await bankaccountApi.getAllSavingsTransactions({ nAccountId })
        : []
      setTransactions(Array.isArray(txns) ? txns : [])
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to load account')
      setAccountDetails(null)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const account = accounts.find((a) => a.sAccountNo === selectedAccountNo)
  const showDetails = Boolean(selectedAccountNo && (accountDetails || transactions.length > 0))

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>Pass Book Print</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select an account to view details and print passbook.
      </Typography>
      {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
      <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Account</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              select
              size="small"
              label="Account Number"
              value={selectedAccountNo}
              onChange={(e) => {
                setSelectedAccountNo(e.target.value)
                setAccountDetails(null)
                setTransactions([])
              }}
              disabled={loadingAccounts}
              sx={{ minWidth: 280 }}
            >
              <MenuItem value="">Select account</MenuItem>
              {accounts.map((a) => (
                <MenuItem key={a._id ?? a.sAccountNo} value={a.sAccountNo ?? ''}>{a.sAccountNo} – {a.sApplicantName ?? '–'}</MenuItem>
              ))}
            </TextField>
            <Button type="button" variant="contained" onClick={handleShowDetails} disabled={!selectedAccountNo || loading}>
              {loading ? <CircularProgress size={24} /> : 'Show Account Details'}
            </Button>
            <Button type="button" variant="outlined" disabled={!showDetails} onClick={() => window.print()}>Print</Button>
          </Box>
        </CardContent>
      </Card>

      {showDetails && (accountDetails || account) && (
        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }} className="passbook-print-area">
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Account Details</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2, mb: 2 }}>
              <Box><Typography variant="caption" color="text.secondary">Account Number</Typography><Typography variant="body2">{selectedAccountNo}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Customer ID</Typography><Typography variant="body2">{(accountDetails ?? account)?.sCustomerId ?? '–'}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Branch Code</Typography><Typography variant="body2">{(accountDetails ?? account)?.sBranchCode ?? '–'}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Customer Name</Typography><Typography variant="body2">{(accountDetails ?? account)?.sApplicantName ?? account?.sApplicantName ?? '–'}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Aadhar No</Typography><Typography variant="body2">{(accountDetails ?? account)?.sAadharNo ?? '–'}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Village Branch Name</Typography><Typography variant="body2">{(accountDetails ?? account)?.sMandalBranchName ?? '–'}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Father/Husband Name</Typography><Typography variant="body2">{(accountDetails ?? account)?.sFatherOrHusbandName ?? '–'}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Mobile Number</Typography><Typography variant="body2">{(accountDetails ?? account)?.sMobileNumber ?? '–'}</Typography></Box>
              <Box sx={{ gridColumn: '1 / -1' }}><Typography variant="caption" color="text.secondary">Address</Typography><Typography variant="body2">{(accountDetails ?? account)?.sVillageAddress ?? (accountDetails ?? account)?.sStreetName ?? '–'}</Typography></Box>
            </Box>
            <Typography variant="subtitle2" gutterBottom>Transactions</Typography>
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
                {transactions.map((t, i) => (
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
    </div>
  )
}
