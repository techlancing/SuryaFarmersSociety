import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const AADHAR_REGEX = /^[2-9]{1}[0-9]{3}\s{0,1}[0-9]{4}\s{0,1}[0-9]{4}$/
const MOBILE_REGEX = /^([+]91[\s]*)?[6-9]{1}[0-9]{9}$/

const DESIGNATIONS = [
  { value: '01', label: 'Manager' },
  { value: '02', label: 'Accountant' },
  { value: '03', label: 'Field Officer' },
  { value: '04', label: 'Cashier' },
  { value: '05', label: 'Office Boy' },
]

interface FormValues {
  employeeCallLetterId: string
  employeeId: string
  callLetterIssuedDate: string
  joiningDate: string
  employeeName: string
  fatherOrHusbandName: string
  motherName: string
  aadharNo: string
  mobileNumber: string
  nationality: string
  religion: string
  speakLanguage: string
  appointmentType: 'Trainee' | 'Regular'
  designation: string
  accountNo: string
  ifscCode: string
  branchName: string
  place: string
}

const defaultValues: FormValues = {
  employeeCallLetterId: '',
  employeeId: '',
  callLetterIssuedDate: '',
  joiningDate: '',
  employeeName: '',
  fatherOrHusbandName: '',
  motherName: '',
  aadharNo: '',
  mobileNumber: '',
  nationality: '',
  religion: '',
  speakLanguage: '',
  appointmentType: 'Trainee',
  designation: '',
  accountNo: '',
  ifscCode: '',
  branchName: '',
  place: '',
}

export function AddEmployeePage() {
  const [photoId, setPhotoId] = useState<string>('')
  const [passbookId, setPassbookId] = useState<string>('')
  const [callLetterId, setCallLetterId] = useState<string>('')
  const [aadharId, setAadharId] = useState<string>('')

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({ defaultValues })

  const onDropPhoto = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) setPhotoId(`photo-${Date.now()}`)
  }, [])
  const { getRootProps: getPhotoRootProps, getInputProps: getPhotoInputProps } = useDropzone({
    onDrop: onDropPhoto,
    maxFiles: 1,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
  })

  const onDropPassbook = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) setPassbookId(`passbook-${Date.now()}`)
  }, [])
  const { getRootProps: getPassbookRootProps, getInputProps: getPassbookInputProps } = useDropzone({
    onDrop: onDropPassbook,
    maxFiles: 1,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.pdf'] },
  })

  const onDropCallLetter = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) setCallLetterId(`callletter-${Date.now()}`)
  }, [])
  const { getRootProps: getCallLetterRootProps, getInputProps: getCallLetterInputProps } = useDropzone({
    onDrop: onDropCallLetter,
    maxFiles: 1,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.pdf'] },
  })

  const onDropAadhar = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) setAadharId(`aadhar-${Date.now()}`)
  }, [])
  const { getRootProps: getAadharRootProps, getInputProps: getAadharInputProps } = useDropzone({
    onDrop: onDropAadhar,
    maxFiles: 1,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.pdf'] },
  })

  const onSubmit = (values: FormValues) => {
    if (!photoId || !passbookId || !callLetterId || !aadharId) {
      alert('Please upload all four documents: Photo, Bank Passbook, Call Letter, Aadhar.')
      return
    }
    alert('Bank Employee data is saved successfully.')
    reset(defaultValues)
    setPhotoId('')
    setPassbookId('')
    setCallLetterId('')
    setAadharId('')
  }

  const handleClear = () => {
    reset(defaultValues)
    setPhotoId('')
    setPassbookId('')
    setCallLetterId('')
    setAadharId('')
  }

  const dropzoneSx = {
    border: '1px dashed #ccc',
    borderRadius: 1,
    p: 2,
    textAlign: 'center' as const,
    cursor: 'pointer',
    bgcolor: 'grey.50',
    '&:hover': { bgcolor: 'grey.100' },
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        Add Employee
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Enter employee details and upload required documents.
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Employee Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="employeeCallLetterId"
                  control={control}
                  rules={{ required: 'Employee Call Letter ID is required' }}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Employee Call Letter ID" error={Boolean(errors.employeeCallLetterId)} helperText={errors.employeeCallLetterId?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="employeeId"
                  control={control}
                  rules={{ required: 'Employee ID is required' }}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Employee ID" error={Boolean(errors.employeeId)} helperText={errors.employeeId?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="callLetterIssuedDate"
                  control={control}
                  rules={{ required: 'Call Letter Issued Date is required' }}
                  render={({ field }) => (
                    <TextField {...field} type="date" size="small" fullWidth label="Call Letter Issued Date" InputLabelProps={{ shrink: true }} error={Boolean(errors.callLetterIssuedDate)} helperText={errors.callLetterIssuedDate?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="joiningDate"
                  control={control}
                  rules={{ required: 'Joining Date is required' }}
                  render={({ field }) => (
                    <TextField {...field} type="date" size="small" fullWidth label="Joining Date" InputLabelProps={{ shrink: true }} error={Boolean(errors.joiningDate)} helperText={errors.joiningDate?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="employeeName"
                  control={control}
                  rules={{ required: 'Employee Name is required' }}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Employee Name" error={Boolean(errors.employeeName)} helperText={errors.employeeName?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="fatherOrHusbandName"
                  control={control}
                  rules={{ required: 'Father/Husband Name is required' }}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Father/Husband Name" error={Boolean(errors.fatherOrHusbandName)} helperText={errors.fatherOrHusbandName?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="motherName"
                  control={control}
                  rules={{ required: 'Mother Name is required' }}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Mother Name" error={Boolean(errors.motherName)} helperText={errors.motherName?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="aadharNo"
                  control={control}
                  rules={{
                    required: 'Aadhar No is required',
                    pattern: { value: AADHAR_REGEX, message: 'Enter a valid 12-digit Aadhar number' },
                  }}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Aadhar No" placeholder="1234 5678 9012" error={Boolean(errors.aadharNo)} helperText={errors.aadharNo?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="mobileNumber"
                  control={control}
                  rules={{
                    required: 'Mobile No is required',
                    pattern: { value: MOBILE_REGEX, message: 'Enter a valid 10-digit mobile number' },
                  }}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Mobile No" placeholder="9876543210" error={Boolean(errors.mobileNumber)} helperText={errors.mobileNumber?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="nationality"
                  control={control}
                  rules={{ required: 'Nationality is required' }}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Nationality" error={Boolean(errors.nationality)} helperText={errors.nationality?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="religion"
                  control={control}
                  rules={{ required: 'Religion is required' }}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Religion" error={Boolean(errors.religion)} helperText={errors.religion?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="speakLanguage"
                  control={control}
                  rules={{ required: 'Speak Language is required' }}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Speak Language" error={Boolean(errors.speakLanguage)} helperText={errors.speakLanguage?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="appointmentType"
                  control={control}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Appointment Type</Typography>
                      <RadioGroup row {...field}>
                        <FormControlLabel value="Trainee" control={<Radio />} label="Trainee" />
                        <FormControlLabel value="Regular" control={<Radio />} label="Regular" />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="designation"
                  control={control}
                  rules={{ required: 'Designation is required' }}
                  render={({ field }) => (
                    <TextField {...field} select size="small" fullWidth label="Designation" error={Boolean(errors.designation)} helperText={errors.designation?.message}>
                      <MenuItem value="">Select</MenuItem>
                      {DESIGNATIONS.map((d) => (
                        <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="accountNo"
                  control={control}
                  rules={{ required: 'Employee Account No is required' }}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Employee Account No" error={Boolean(errors.accountNo)} helperText={errors.accountNo?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="ifscCode"
                  control={control}
                  rules={{ required: 'IFSC Code is required' }}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="IFSC Code" error={Boolean(errors.ifscCode)} helperText={errors.ifscCode?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="branchName"
                  control={control}
                  rules={{ required: 'Name of the branch is required' }}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Name of the branch" error={Boolean(errors.branchName)} helperText={errors.branchName?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="place"
                  control={control}
                  rules={{ required: 'Place of the branch is required' }}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Place of the branch" error={Boolean(errors.place)} helperText={errors.place?.message} />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Documents (all required)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box {...getPhotoRootProps()} sx={dropzoneSx}>
                  <input {...getPhotoInputProps()} />
                  <Typography variant="caption" display="block">Photo Upload</Typography>
                  {photoId && <Typography variant="caption" color="primary">Uploaded</Typography>}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box {...getPassbookRootProps()} sx={dropzoneSx}>
                  <input {...getPassbookInputProps()} />
                  <Typography variant="caption" display="block">Bank Passbook Upload</Typography>
                  {passbookId && <Typography variant="caption" color="primary">Uploaded</Typography>}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box {...getCallLetterRootProps()} sx={dropzoneSx}>
                  <input {...getCallLetterInputProps()} />
                  <Typography variant="caption" display="block">Call Letter Upload</Typography>
                  {callLetterId && <Typography variant="caption" color="primary">Uploaded</Typography>}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box {...getAadharRootProps()} sx={dropzoneSx}>
                  <input {...getAadharInputProps()} />
                  <Typography variant="caption" display="block">Aadhar Upload</Typography>
                  {aadharId && <Typography variant="caption" color="primary">Uploaded</Typography>}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained">Save & Submit</Button>
          <Button type="button" variant="outlined" onClick={handleClear}>Clear</Button>
        </Box>
      </Box>
    </div>
  )
}
