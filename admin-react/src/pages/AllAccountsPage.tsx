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
import { useMemo, useState, useEffect } from 'react'
import * as bankaccountApi from '../api/services/bankaccount'
import type { BankAccount } from '../api/services/bankaccount'
import type { ApiError } from '../api/client'

export function AllAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    bankaccountApi
      .getAllBankAccounts()
      .then((list) => {
        if (!cancelled) setAccounts(Array.isArray(list) ? list : [])
      })
      .catch((e: ApiError) => {
        if (!cancelled) setError(e?.message || 'Failed to load accounts')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return accounts
    const t = searchTerm.toLowerCase()
    return accounts.filter(
      (r) =>
        (r.sAccountNo?.toLowerCase().includes(t)) ||
        (r.sBranchCode?.toLowerCase().includes(t)) ||
        (String(r.sCustomerId ?? '').toLowerCase().includes(t)) ||
        (r.sApplicantName?.toLowerCase().includes(t)),
    )
  }, [accounts, searchTerm])

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        All Bank Accounts
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Search and view all bank accounts.
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search by account no, branch, customer id, name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 320 }}
            />
          </Box>
          {loading ? (
            <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Account No</TableCell>
                    <TableCell>Branch Code</TableCell>
                    <TableCell>Customer Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row._id ?? row.sAccountNo ?? row.nAccountId}>
                      <TableCell>{row.sAccountNo ?? '–'}</TableCell>
                      <TableCell>{row.sBranchCode ?? '–'}</TableCell>
                      <TableCell>{String(row.sCustomerId ?? '–')}</TableCell>
                      <TableCell>{row.sApplicantName ?? '–'}</TableCell>
                      <TableCell>{row.bIsDeactivated ? 'Deactivated' : 'Active'}</TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="outlined">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filtered.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No accounts found.
                </Typography>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
