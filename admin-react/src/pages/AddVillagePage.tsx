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
import * as mandalApi from '../api/services/mandal'
import * as villageApi from '../api/services/village'
import type { Mandal } from '../api/services/mandal'
import type { Village } from '../api/services/village'
import type { ApiError } from '../api/client'

interface FormValues {
  mandalId: string
  villageName: string
}

export function AddVillagePage() {
  const [mandals, setMandals] = useState<Mandal[]>([])
  const [villages, setVillages] = useState<Village[]>([])
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
    defaultValues: { mandalId: '', villageName: '' },
  })

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [mandalList, villageList] = await Promise.all([
        mandalApi.getMandalList(),
        villageApi.getVillageList(),
      ])
      setMandals(Array.isArray(mandalList) ? mandalList : [])
      setVillages(Array.isArray(villageList) ? villageList : [])
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

  const mandalNameMap: Record<number, string> = {}
  mandals.forEach((m) => {
    if (m.nMandalId != null) mandalNameMap[m.nMandalId] = m.sMandalName ?? ''
  })

  const onSubmit = async (values: FormValues) => {
    const name = values.villageName.trim()
    if (!name) {
      setFormError('villageName', { message: 'Please enter a valid Village Name' })
      return
    }
    if (!values.mandalId) {
      setFormError('mandalId', { message: 'Please select a Mandal' })
      return
    }
    const mandalId = Number(values.mandalId)
    const exists = villages.some(
      (v) => v.sVillageName?.toLowerCase() === name.toLowerCase() && v.nMandalId === mandalId,
    )
    if (exists) {
      setFormError('villageName', { message: 'Village Name already exists in this mandal' })
      return
    }
    setSubmitLoading(true)
    setError(null)
    try {
      await villageApi.addVillage({ nMandalId: mandalId, sVillageName: name })
      await loadData()
      reset()
      clearErrors(['villageName', 'mandalId'])
    } catch (e) {
      const err = e as ApiError
      setFormError('villageName', { message: err?.message || 'Failed to add village' })
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleClear = () => {
    reset()
    clearErrors(['villageName', 'mandalId'])
  }

  const handleDelete = async (village: Village) => {
    const id = village._id
    if (!id) return
    if (!window.confirm(`Do you want to delete "${village.sVillageName}"? This cannot be undone.`)) return
    setError(null)
    try {
      await villageApi.deleteVillage({ _id: id })
      await loadData()
    } catch (e) {
      const err = e as ApiError
      setError(err?.message || 'Failed to delete village')
    }
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        Add Village
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select a mandal and add a village. Village name must be unique within the mandal.
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
              Village Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
              <Controller
                name="mandalId"
                control={control}
                rules={{ required: 'Please select a Mandal' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    size="small"
                    fullWidth
                    label="Select Mandal"
                    error={Boolean(errors.mandalId)}
                    helperText={errors.mandalId?.message}
                  >
                    <MenuItem value="">Select mandal</MenuItem>
                    {mandals.map((m) => (
                      <MenuItem key={m._id ?? m.nMandalId} value={String(m.nMandalId)}>
                        {m.sMandalName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="villageName"
                control={control}
                rules={{
                  validate: (v) => {
                    if (!v || !v.trim()) return 'Please enter a valid Village Name'
                    return true
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    label="Village Name"
                    error={Boolean(errors.villageName)}
                    helperText={errors.villageName?.message}
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
              Village List (by Mandal)
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
                    <TableCell>Village ID</TableCell>
                    <TableCell>Village Name</TableCell>
                    <TableCell>Mandal</TableCell>
                    <TableCell align="right">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {villages.map((v, i) => (
                    <TableRow key={v._id ?? v.nVillageId ?? i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{v.nVillageId ?? '–'}</TableCell>
                      <TableCell>{v.sVillageName}</TableCell>
                      <TableCell>{v.nMandalId != null ? mandalNameMap[v.nMandalId] ?? v.nMandalId : '–'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          aria-label="delete"
                          onClick={() => handleDelete(v)}
                          disabled={!v._id}
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
