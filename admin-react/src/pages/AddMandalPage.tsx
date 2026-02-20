import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Controller, useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import * as districtApi from '../api/services/district'
import * as mandalApi from '../api/services/mandal'
import type { District } from '../api/services/district'
import type { Mandal } from '../api/services/mandal'
import type { ApiError } from '../api/client'

interface FormValues {
  districtId: string
  mandalName: string
}

export function AddMandalPage() {
  const [districts, setDistricts] = useState<District[]>([])
  const [mandals, setMandals] = useState<Mandal[]>([])
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    setError: setFormError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: { districtId: '', mandalName: '' },
  })

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [districtList, mandalList] = await Promise.all([
        districtApi.getDistrictList(),
        mandalApi.getMandalList(),
      ])
      setDistricts(Array.isArray(districtList) ? districtList : [])
      setMandals(Array.isArray(mandalList) ? mandalList : [])
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const districtNameMap: Record<number, string> = {}
  districts.forEach((d) => {
    if (d.nDistrictId != null) districtNameMap[d.nDistrictId] = d.sDistrictName ?? ''
  })

  const onSubmit = async (values: FormValues) => {
    const name = values.mandalName.trim()
    if (!name) {
      setFormError('mandalName', { message: 'Please enter a valid Mandal Name' })
      return
    }
    if (!values.districtId) {
      setFormError('districtId', { message: 'Please select a District' })
      return
    }
    const districtId = Number(values.districtId)
    const exists = mandals.some(
      (m) => m.sMandalName?.toLowerCase() === name.toLowerCase() && m.nDistrictId === districtId,
    )
    if (exists) {
      setFormError('mandalName', { message: 'Mandal Name already exists in this district' })
      return
    }
    setSubmitLoading(true)
    setError(null)
    try {
      await mandalApi.addMandal({ nDistrictId: districtId, sMandalName: name })
      await loadData()
      reset()
      clearErrors(['mandalName', 'districtId'])
    } catch (e) {
      const err = e as ApiError
      setFormError('mandalName', { message: err?.message || 'Failed to add mandal' })
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleClear = () => {
    reset()
    clearErrors(['mandalName', 'districtId'])
  }

  const handleDelete = async (mandal: Mandal) => {
    const id = mandal._id
    if (!id) return
    if (!window.confirm(`Do you want to delete "${mandal.sMandalName}"? This cannot be undone.`)) return
    setError(null)
    try {
      await mandalApi.deleteMandal({ _id: id })
      await loadData()
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to delete mandal')
    }
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        Add Mandal
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select a district and add a mandal. Mandal name must be unique within the district.
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Mandal Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
              <Controller
                name="districtId"
                control={control}
                rules={{ required: 'Please select a District' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    size="small"
                    fullWidth
                    label="Select District"
                    error={Boolean(errors.districtId)}
                    helperText={errors.districtId?.message}
                  >
                    <MenuItem value="">Select district</MenuItem>
                    {districts.map((d) => (
                      <MenuItem key={d._id ?? d.nDistrictId} value={String(d.nDistrictId)}>
                        {d.sDistrictName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="mandalName"
                control={control}
                rules={{
                  validate: (v) => {
                    if (!v || !v.trim()) return 'Please enter a valid Mandal Name'
                    return true
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    label="Mandal Name"
                    error={Boolean(errors.mandalName)}
                    helperText={errors.mandalName?.message}
                  />
                )}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button type="submit" variant="contained" disabled={submitLoading}>
                  {submitLoading ? <CircularProgress size={24} /> : 'Add'}
                </Button>
                <Button type="button" variant="outlined" onClick={handleClear}>
                  Clear
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Mandal List (by District)
            </Typography>
            {loading ? (
              <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell>Mandal ID</TableCell>
                    <TableCell>Mandal Name</TableCell>
                    <TableCell>District</TableCell>
                    <TableCell align="right">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mandals.map((m, i) => (
                    <TableRow key={m._id ?? m.nMandalId ?? i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{m.nMandalId ?? '–'}</TableCell>
                      <TableCell>{m.sMandalName}</TableCell>
                      <TableCell>{m.nDistrictId != null ? districtNameMap[m.nDistrictId] ?? m.nDistrictId : '–'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          aria-label="delete"
                          onClick={() => handleDelete(m)}
                          disabled={!m._id}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Box>
    </div>
  )
}
