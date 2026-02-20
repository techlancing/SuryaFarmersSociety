import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import { createUserAccount } from '../api/services/account'
import type { ApiError } from '../api/client'

const ROLES = [
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' },
]

interface FormValues {
  username: string
  email: string
  password: string
  repeatPassword: string
  role: string
  mobile: string
}

export function CreateEmployeeLoginPage() {
  const [submitLoading, setSubmitLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    watch,
    setError: setFormError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
      role: '',
      mobile: '',
    },
  })

  const password = watch('password')

  const onSubmit = async (values: FormValues) => {
    if (values.password !== values.repeatPassword) {
      setFormError('repeatPassword', { message: 'Password mismatch' })
      return
    }
    setError(null)
    setSuccess(null)
    setSubmitLoading(true)
    try {
      const res = await createUserAccount({
        sName: values.username.trim(),
        sEmail: values.email.trim(),
        sPassword: values.password,
        sRole: values.role || 'employee',
        nMobile: values.mobile.trim() ? Number(values.mobile) : 0,
      })
      if (typeof res === 'object' && res !== null && 'error' in res) {
        setError((res as { error: string }).error)
        return
      }
      setSuccess('Account created successfully.')
      reset()
      clearErrors()
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to create account')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleClear = () => {
    reset()
    clearErrors()
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        Create Employee Login
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Create a new account for Manager or Employee. Passwords must match.
      </Typography>

      {success && (
        <Typography color="success.main" sx={{ mb: 1 }}>
          {success}
        </Typography>
      )}
      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card elevation={0} sx={{ maxWidth: 560, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              New Account
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: 'User Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="User Name"
                      placeholder="Enter username"
                      error={Boolean(errors.username)}
                      helperText={errors.username?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                      message: 'Enter a valid email address',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="email"
                      size="small"
                      fullWidth
                      label="Email Id"
                      placeholder="Enter Email"
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: 'Password is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="password"
                      size="small"
                      fullWidth
                      label="Password"
                      placeholder="Enter Password"
                      error={Boolean(errors.password)}
                      helperText={errors.password?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="repeatPassword"
                  control={control}
                  rules={{
                    required: 'Repeat password is required',
                    validate: (v) => v === password || 'Password mismatch',
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="password"
                      size="small"
                      fullWidth
                      label="Repeat password"
                      placeholder="Re-Enter Password"
                      error={Boolean(errors.repeatPassword)}
                      helperText={errors.repeatPassword?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: 'Role is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      size="small"
                      fullWidth
                      label="Role"
                      placeholder="Select Role"
                      error={Boolean(errors.role)}
                      helperText={errors.role?.message}
                    >
                      <MenuItem value="">Select Role</MenuItem>
                      {ROLES.map((r) => (
                        <MenuItem key={r.value} value={r.value}>
                          {r.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Button type="submit" variant="contained" disabled={submitLoading}>
                    {submitLoading ? 'Creating…' : 'Submit'}
                  </Button>
                  <Button type="button" variant="outlined" onClick={handleClear}>
                    Clear
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </div>
  )
}
