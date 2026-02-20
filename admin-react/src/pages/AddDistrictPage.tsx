import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
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
import type { District } from '../api/services/district'
import type { ApiError } from '../api/client'

interface FormValues {
  districtName: string
}

export function AddDistrictPage() {
  const [districts, setDistricts] = useState<District[]>([])
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
    defaultValues: { districtName: '' },
  })

  const loadDistricts = async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await districtApi.getDistrictList()
      setDistricts(Array.isArray(list) ? list : [])
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to load districts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDistricts()
  }, [])

  const onSubmit = async (values: FormValues) => {
    const name = values.districtName.trim()
    if (!name) {
      setFormError('districtName', { message: 'Please enter a valid District Name' })
      return
    }
    const exists = districts.some((d) => d.sDistrictName?.toLowerCase() === name.toLowerCase())
    if (exists) {
      setFormError('districtName', { message: 'District Name already exists' })
      return
    }
    setSubmitLoading(true)
    setError(null)
    try {
      await districtApi.addDistrict({ sDistrictName: name })
      await loadDistricts()
      reset()
      clearErrors('districtName')
    } catch (e) {
      const err = e as ApiError
      setFormError('districtName', { message: err?.message || 'Failed to add district' })
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleClear = () => {
    reset()
    clearErrors('districtName')
  }

  const handleDelete = async (district: District) => {
    const id = district._id
    if (!id) return
    if (!window.confirm(`Do you want to delete "${district.sDistrictName}"? This cannot be undone.`)) return
    setError(null)
    try {
      await districtApi.deleteDistrict({ _id: id })
      await loadDistricts()
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to delete district')
    }
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        Add District
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Add a new district. District name must be unique.
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
              District Information
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
              <Controller
                name="districtName"
                control={control}
                rules={{
                  validate: (v) => {
                    if (!v || !v.trim()) return 'Please enter a valid District Name'
                    return true
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="District Name"
                    sx={{ minWidth: 280 }}
                    error={Boolean(errors.districtName)}
                    helperText={errors.districtName?.message}
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
              District List
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
                    <TableCell>District ID</TableCell>
                    <TableCell>District Name</TableCell>
                    <TableCell align="right">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {districts.map((d, i) => (
                    <TableRow key={d._id ?? d.nDistrictId ?? i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{d.nDistrictId ?? '–'}</TableCell>
                      <TableCell>{d.sDistrictName}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          aria-label="delete"
                          onClick={() => handleDelete(d)}
                          disabled={!d._id}
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
