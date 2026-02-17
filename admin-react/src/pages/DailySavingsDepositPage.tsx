import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
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
import { useMemo, useState } from 'react'

interface AccountSummary {
  id: string
  accountNo: string
  holderName: string
}

interface TransactionRow {
  id: number
  date: string
  accountNo: string
  credit: number
  debit: number
  balance: number
  narration: string
  employeeName: string
}

interface DailySavingsFormValues {
  date: string
  amount: string
  receiverName: string
  narration: string
}

const MOCK_ACCOUNTS: AccountSummary[] = [
  { id: '1', accountNo: '010101010001', holderName: 'Ramesh Kumar' },
  { id: '2', accountNo: '010101010002', holderName: 'Suresh Reddy' },
]

const MOCK_TRANSACTIONS: Record<string, TransactionRow[]> = {
  '010101010001': [
    {
      id: 1,
      date: '01-01-2026',
      accountNo: '010101010001',
      credit: 0,
      debit: 500,
      balance: 500,
      narration: 'New_Account_Created',
      employeeName: 'Staff A',
    },
    {
      id: 2,
      date: '05-01-2026',
      accountNo: '010101010001',
      credit: 0,
      debit: 200,
      balance: 700,
      narration: 'Daily_Deposit',
      employeeName: 'Staff B',
    },
  ],
  '010101010002': [
    {
      id: 1,
      date: '02-01-2026',
      accountNo: '010101010002',
      credit: 0,
      debit: 1000,
      balance: 1000,
      narration: 'New_Account_Created',
      employeeName: 'Staff C',
    },
  ],
}

const MOCK_EMPLOYEES = ['Staff A', 'Staff B', 'Staff C']

export function DailySavingsDepositPage() {
  const [selectedAccount, setSelectedAccount] = useState<AccountSummary | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DailySavingsFormValues>({
    defaultValues: {
      date: '',
      amount: '',
      receiverName: '',
      narration: '',
    },
  })

  const transactions = useMemo(
    () =>
      selectedAccount
        ? MOCK_TRANSACTIONS[selectedAccount.accountNo] ?? []
        : [],
    [selectedAccount],
  )

  const onSubmit = (values: DailySavingsFormValues) => {
    if (!selectedAccount) {
      alert('Please select an account first.')
      return
    }

    if (!values.date || !values.amount || !values.receiverName || !values.narration) {
      alert('Please fill all the fields.')
      return
    }

    // This mirrors the Angular submit behaviour:
    // - Validate required fields
    // - Call service to add daily savings debit
    // - On Success: show success message with transaction id and note that it needs approval
    // For now we mock a transaction id.
    const mockTransactionId = Math.floor(Math.random() * 1000000)
    alert(
      `Amount deposited successfully.\nTransaction id "${mockTransactionId}" needs to be approved.`,
    )
  }

  const handlePrint = () => {
    if (!selectedAccount) {
      alert('Please select an account before printing.')
      return
    }
    window.print()
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        Daily Savings Deposit
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select a savings account to view its transactions and record a new daily savings deposit.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2, mt: 0.5 }}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            size="small"
            fullWidth
            label="Select Account"
            value={selectedAccount?.accountNo ?? ''}
            onChange={(e) => {
              const account = MOCK_ACCOUNTS.find((a) => a.accountNo === e.target.value) ?? null
              setSelectedAccount(account)
            }}
          >
            {MOCK_ACCOUNTS.map((a) => (
              <MenuItem key={a.id} value={a.accountNo}>
                {a.accountNo} – {a.holderName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {selectedAccount && (
        <>
          <Card
            elevation={0}
            sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1.5,
                }}
              >
                <Typography variant="subtitle1">Savings Account Transactions</Typography>
                <Button variant="outlined" size="small" onClick={handlePrint}>
                  Print
                </Button>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Account Number</TableCell>
                    <TableCell align="right">Credit</TableCell>
                    <TableCell align="right">Debit</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Narration</TableCell>
                    <TableCell>Employee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.date}</TableCell>
                      <TableCell>{t.accountNo}</TableCell>
                      <TableCell align="right">
                        {t.credit ? t.credit.toLocaleString() : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {t.debit ? t.debit.toLocaleString() : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {t.balance.toLocaleString()}
                      </TableCell>
                      <TableCell>{t.id}</TableCell>
                      <TableCell>{t.narration}</TableCell>
                      <TableCell>{t.employeeName}</TableCell>
                    </TableRow>
                  ))}
                  {transactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography variant="body2" color="text.secondary">
                          No transactions found for this account.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}
          >
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Savings Account – Debit
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ mt: 1 }}
              >
                <Grid container spacing={2}>
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
                      rules={{ required: 'Total amount is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          size="small"
                          fullWidth
                          label="Total Amount"
                          error={Boolean(errors.amount)}
                          helperText={errors.amount?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="receiverName"
                      control={control}
                      rules={{ required: 'Received employee is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          size="small"
                          fullWidth
                          label="Received Employee"
                          error={Boolean(errors.receiverName)}
                          helperText={errors.receiverName?.message}
                        >
                          {MOCK_EMPLOYEES.map((name) => (
                            <MenuItem key={name} value={name}>
                              {name}
                            </MenuItem>
                          ))}
                        </TextField>
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
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Button type="submit" variant="contained">
                        Deposit &amp; Send SMS
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => window.location.reload()}
                      >
                        Clear
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

