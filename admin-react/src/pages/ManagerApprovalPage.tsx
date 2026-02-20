import {
  Box,
  Button,
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
import RefreshIcon from '@mui/icons-material/Refresh'
import { useState, useMemo, useEffect } from 'react'
import * as creditloanApi from '../api/services/creditloan'
import * as transactionApi from '../api/services/transaction'
import * as savingstypeApi from '../api/services/savingstype'
import type { CreditLoanDetail } from '../api/services/creditloan'
import type { Transaction } from '../api/services/transaction'
import type { SavingTypeDetail } from '../api/services/savingstype'
import type { ApiError } from '../api/client'

type ApprovalType = 'loan' | 'credit' | 'savings'

type LoanApproval = Pick<CreditLoanDetail, 'sAccountNo' | 'sTypeofLoan' | 'sDate' | 'nSanctionAmount' | 'nTotalAmount' | 'sIsApproved'> & { nLoanId?: number; _id?: string }
type CreditApproval = Pick<Transaction, 'sAccountNo' | 'sAccountType' | 'sDate' | 'nCreditAmount' | 'nDebitAmount' | 'nBalanceAmount' | 'nTransactionId' | 'sIsApproved'> & { nLoanId?: number }
type SavingsApproval = Pick<SavingTypeDetail, 'sAccountNo' | 'sTypeofSavings' | 'sStartDate' | 'sMaturityDate' | 'nDepositAmount' | 'nMaturityAmount' | 'sIsApproved'> & { nSavingsId?: number }

interface ManagerApprovalPageProps {
  type: ApprovalType
}

const TABLE_TITLES: Record<ApprovalType, string> = {
  loan: 'Loan',
  credit: 'Credit and Debit',
  savings: 'Saving Deposits',
}

export function ManagerApprovalPage({ type }: ManagerApprovalPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [loans, setLoans] = useState<LoanApproval[]>([])
  const [credits, setCredits] = useState<CreditApproval[]>([])
  const [savings, setSavings] = useState<SavingsApproval[]>([])
  const [disabledId, setDisabledId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const title = TABLE_TITLES[type]

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      if (type === 'loan') {
        const list = await creditloanApi.needToApproveGetallcreditloans()
        setLoans(Array.isArray(list) ? list : [])
      } else if (type === 'credit') {
        const list = await transactionApi.getNeedToApproveTransactionList()
        setCredits(Array.isArray(list) ? list : [])
      } else {
        const list = await savingstypeApi.needToApproveSavingstypeList()
        setSavings(Array.isArray(list) ? list : [])
      }
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [type])

  const filteredLoans = useMemo(() => {
    if (!searchTerm.trim()) return loans
    const t = searchTerm.toLowerCase()
    return loans.filter((r) => r.sAccountNo.toLowerCase().includes(t) || r.sTypeofLoan.toLowerCase().includes(t))
  }, [loans, searchTerm])

  const filteredCredits = useMemo(() => {
    if (!searchTerm.trim()) return credits
    const t = searchTerm.toLowerCase()
    return credits.filter(
      (r) =>
        r.sAccountNo.toLowerCase().includes(t) ||
        r.sAccountType.toLowerCase().includes(t) ||
        String(r.nTransactionId).includes(t),
    )
  }, [credits, searchTerm])

  const filteredSavings = useMemo(() => {
    if (!searchTerm.trim()) return savings
    const t = searchTerm.toLowerCase()
    return savings.filter(
      (r) => r.sAccountNo.toLowerCase().includes(t) || r.sTypeofSavings.toLowerCase().includes(t),
    )
  }, [savings, searchTerm])

  const handleApprove = async (item: LoanApproval | CreditApproval | SavingsApproval) => {
    const name = 'sTypeofLoan' in item ? item.sTypeofLoan : 'sAccountType' in item ? item.sAccountType : (item as SavingsApproval).sTypeofSavings
    const amount = 'nSanctionAmount' in item ? (item as LoanApproval).nSanctionAmount : 'nCreditAmount' in item ? ((item as CreditApproval).nDebitAmount || (item as CreditApproval).nCreditAmount) : (item as SavingsApproval).nMaturityAmount
    const msg = `Do you want to change the present status (${item.sIsApproved}) of "${name}" as "Approved"? A/C: ${item.sAccountNo}  Amount: ${amount}`
    if (!window.confirm(msg)) return
    const id = item.sAccountNo + (('nTransactionId' in item && item.nTransactionId) || name)
    setDisabledId(id)
    try {
      if (type === 'loan') {
        await creditloanApi.setcreditloanapprovalstatus({ sAccountNo: (item as LoanApproval).sAccountNo, nLoanId: (item as LoanApproval).nLoanId!, sIsApproved: 'Approved' })
        setLoans((prev) => prev.filter((r) => r !== item))
        setError(null)
      } else if (type === 'credit') {
        const c = item as CreditApproval
        await transactionApi.setTransactionApprovalStatus({ nTransactionId: c.nTransactionId!, sAccountNo: c.sAccountNo!, nLoanId: c.nLoanId ?? 0, sIsApproved: 'Approved' })
        setCredits((prev) => prev.filter((r) => r !== item))
        setError(null)
      } else {
        await savingstypeApi.setSavingstypeApprovalStatus({ nSavingsId: (item as SavingsApproval).nSavingsId!, sIsApproved: 'Approved', sStatus: 'Active' })
        setSavings((prev) => prev.filter((r) => r !== item))
        setError(null)
      }
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to approve')
    } finally {
      setDisabledId(null)
    }
  }

  const handleReject = async (item: LoanApproval | CreditApproval | SavingsApproval) => {
    const name = 'sTypeofLoan' in item ? item.sTypeofLoan : 'sAccountType' in item ? item.sAccountType : (item as SavingsApproval).sTypeofSavings
    const msg = `Do you want to change the present status (${item.sIsApproved}) of "${name}" as "Rejected"?`
    if (!window.confirm(msg)) return
    setDisabledId(item.sAccountNo + name)
    try {
      if (type === 'loan') {
        await creditloanApi.setcreditloanapprovalstatus({ sAccountNo: (item as LoanApproval).sAccountNo, nLoanId: (item as LoanApproval).nLoanId!, sIsApproved: 'Rejected' })
        setLoans((prev) => prev.filter((r) => r !== item))
        setError(null)
      } else if (type === 'credit') {
        const c = item as CreditApproval
        await transactionApi.setTransactionApprovalStatus({ nTransactionId: c.nTransactionId!, sAccountNo: c.sAccountNo!, nLoanId: c.nLoanId ?? 0, sIsApproved: 'Rejected' })
        setCredits((prev) => prev.filter((r) => r !== item))
        setError(null)
      } else {
        await savingstypeApi.setSavingstypeApprovalStatus({ nSavingsId: (item as SavingsApproval).nSavingsId!, sIsApproved: 'Rejected', sStatus: 'InActive' })
        setSavings((prev) => prev.filter((r) => r !== item))
        setError(null)
      }
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to reject')
    } finally {
      setDisabledId(null)
    }
  }

  const handleRefresh = () => {
    setSearchTerm('')
    loadData()
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        All {title} Approvals
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Search and approve or reject pending items.
      </Typography>
      {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}

      <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
              Refresh
            </Button>
          </Box>

          {loading && (
            <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
          )}
          {!loading && type === 'loan' && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Account Number</TableCell>
                  <TableCell>{title} Name</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Sanction Amount</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Approved Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLoans.map((row) => (
                  <TableRow key={row.sAccountNo + row.sTypeofLoan + (row.nLoanId ?? '')}>
                    <TableCell>{row.sAccountNo}</TableCell>
                    <TableCell>{row.sTypeofLoan}</TableCell>
                    <TableCell>{row.sDate ?? '–'}</TableCell>
                    <TableCell>{(row.nSanctionAmount ?? 0).toLocaleString()}</TableCell>
                    <TableCell>{(row.nTotalAmount ?? 0).toLocaleString()}</TableCell>
                    <TableCell>{row.sIsApproved}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        sx={{ mr: 1 }}
                        disabled={row.sIsApproved === 'Approved' || disabledId !== null}
                        onClick={() => handleApprove(row)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={row.sIsApproved === 'Rejected' || disabledId !== null}
                        onClick={() => handleReject(row)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!loading && type === 'credit' && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Account Number</TableCell>
                  <TableCell>{title} Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Credit</TableCell>
                  <TableCell align="right">Debit</TableCell>
                  <TableCell align="right">Balance</TableCell>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Approved Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCredits.map((row) => (
                  <TableRow key={row.sAccountNo + (row.nTransactionId ?? '')}>
                    <TableCell>{row.sAccountNo}</TableCell>
                    <TableCell>{row.sAccountType ?? '–'}</TableCell>
                    <TableCell>{row.sDate ?? '–'}</TableCell>
                    <TableCell align="right">{row.nCreditAmount ? Number(row.nCreditAmount).toLocaleString() : '–'}</TableCell>
                    <TableCell align="right">{row.nDebitAmount ? Number(row.nDebitAmount).toLocaleString() : '–'}</TableCell>
                    <TableCell align="right">{(row.nBalanceAmount != null) ? Number(row.nBalanceAmount).toLocaleString() : '–'}</TableCell>
                    <TableCell>{row.nTransactionId ?? '–'}</TableCell>
                    <TableCell>{row.sIsApproved}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        sx={{ mr: 1 }}
                        disabled={row.sIsApproved === 'Approved' || disabledId !== null}
                        onClick={() => handleApprove(row)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={row.sIsApproved === 'Rejected' || disabledId !== null}
                        onClick={() => handleReject(row)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!loading && type === 'savings' && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Account Number</TableCell>
                  <TableCell>{title} Name</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Maturity Date</TableCell>
                  <TableCell align="right">Deposited Amount</TableCell>
                  <TableCell align="right">Maturity Amount</TableCell>
                  <TableCell>Approved Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSavings.map((row) => (
                  <TableRow key={row.sAccountNo + row.sTypeofSavings + (row.nSavingsId ?? '')}>
                    <TableCell>{row.sAccountNo}</TableCell>
                    <TableCell>{row.sTypeofSavings}</TableCell>
                    <TableCell>{row.sStartDate ?? '–'}</TableCell>
                    <TableCell>{row.sMaturityDate ?? '–'}</TableCell>
                    <TableCell align="right">{(row.nDepositAmount ?? 0).toLocaleString()}</TableCell>
                    <TableCell align="right">{(row.nMaturityAmount ?? 0).toLocaleString()}</TableCell>
                    <TableCell>{row.sIsApproved}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        sx={{ mr: 1 }}
                        disabled={row.sIsApproved === 'Approved' || disabledId !== null}
                        onClick={() => handleApprove(row)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={row.sIsApproved === 'Rejected' || disabledId !== null}
                        onClick={() => handleReject(row)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {type === 'loan' && filteredLoans.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              No records to display.
            </Typography>
          )}
          {type === 'credit' && filteredCredits.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              No records to display.
            </Typography>
          )}
          {type === 'savings' && filteredSavings.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              No records to display.
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
