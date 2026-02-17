import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useMemo, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

type AccountType = 'Current' | 'Savings'
type AccountCategory = 'Individual' | 'Joint'
type ShareType = 'Single' | 'Double'
type SmsAlert = 'Yes' | 'No'

interface NewAccountFormValues {
  stateCode: string
  districtId: string
  mandalId: string
  villageId: string
  branchCode: string
  accountNo: string
  date: string
  applicantName: string
  applicantSurname: string
  gender: 'Male' | 'Female' | ''
  dob: string
  age: string
  accountType: AccountType | ''
  accountCategory: AccountCategory | ''
  shareType: ShareType | ''
  smsAlert: SmsAlert | ''
  fatherOrHusbandName: string
  motherName: string
  nomineeName: string
  nomineeRelationship: string
  voterId: string
  aadhar: string
  rationCard: string
  flatNo: string
  streetName: string
  villageAddress: string
  mandalAddress: string
  districtAddress: string
  pinCode: string
  mobileNumber: string
  email: string
  employeeName: string
  amount: string
  passportImageId: string
  signature1ImageId: string
  signature2ImageId: string
  document1ImageId: string
  document2ImageId: string
}

const TELANGANA_STATE = { code: '01', name: 'Telangana' }

// Validation patterns copied from Angular component
const VOTER_ID_REGEX = /^([a-zA-Z]){3}([0-9]){7}$/
const AADHAR_REGEX = /^[2-9]{1}[0-9]{3}\s{0,1}[0-9]{4}\s{0,1}[0-9]{4}$/
const RATION_CARD_REGEX = /^([a-zA-Z0-9a-zA-Z]){8,12,15}\s*$/
const MOBILE_REGEX = /([+]{0,1}91[\s]*)?[6-9]{1}[0-9]{9}$/
const PINCODE_REGEX = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/
const EMAIL_REGEX = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/

// Simple mock options – in production you would fetch these from the Node.js APIs
const MOCK_DISTRICTS = [
  { id: '01', name: 'Nizamabad', code: 1 },
  { id: '02', name: 'Kamareddy', code: 2 },
]

const MOCK_MANDALS = [
  { id: '0101', districtId: '01', name: 'Armur', code: 1 },
  { id: '0102', districtId: '01', name: 'Bheemgal', code: 2 },
  { id: '0201', districtId: '02', name: 'Kamareddy', code: 1 },
]

const MOCK_VILLAGES = [
  { id: '010101', mandalId: '0101', name: 'Basar', code: 1 },
  { id: '010102', mandalId: '0101', name: 'Dharmaram', code: 2 },
  { id: '020101', mandalId: '0201', name: 'Adloor', code: 1 },
]

export function NewAccountPage() {
  const [generated, setGenerated] = useState(false)
  const [uploads, setUploads] = useState<{
    passport?: { file: File; preview?: string; refId: string }
    signature1?: { file: File; preview?: string; refId: string }
    signature2?: { file: File; preview?: string; refId: string }
    document1?: { file: File; preview?: string; refId: string }
    document2?: { file: File; preview?: string; refId: string }
  }>({})

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<NewAccountFormValues>({
    defaultValues: {
      stateCode: TELANGANA_STATE.code,
      districtId: '',
      mandalId: '',
      villageId: '',
      branchCode: '',
      accountNo: '',
      date: '',
      applicantName: '',
      applicantSurname: '',
      gender: '',
      dob: '',
      age: '',
      accountType: '',
      accountCategory: '',
      shareType: '',
      smsAlert: '',
      fatherOrHusbandName: '',
      motherName: '',
      nomineeName: '',
      nomineeRelationship: '',
      voterId: '',
      aadhar: '',
      rationCard: '',
      flatNo: '',
      streetName: '',
      villageAddress: '',
      mandalAddress: '',
      districtAddress: '',
      pinCode: '',
      mobileNumber: '',
      email: '',
      employeeName: '',
      amount: '',
      passportImageId: '',
      signature1ImageId: '',
      signature2ImageId: '',
      document1ImageId: '',
      document2ImageId: '',
    },
  })

  const selectedDistrictId = watch('districtId')
  const selectedMandalId = watch('mandalId')
  const selectedVillageId = watch('villageId')

  const availableMandals = useMemo(
    () => MOCK_MANDALS.filter((m) => m.districtId === selectedDistrictId),
    [selectedDistrictId],
  )

  const availableVillages = useMemo(
    () => MOCK_VILLAGES.filter((v) => v.mandalId === selectedMandalId),
    [selectedMandalId],
  )

  const onGenerateAccountDetails = () => {
    const district = MOCK_DISTRICTS.find((d) => d.id === selectedDistrictId)
    const mandal = availableMandals.find((m) => m.id === selectedMandalId)
    const village = availableVillages.find((v) => v.id === selectedVillageId)

    if (!district || !mandal || !village) {
      alert('Please select State, District, Mandal and Village first.')
      return
    }

    const pad2 = (value: number) => (value.toString().length > 1 ? value : `0${value}`)

    const branchCode =
      TELANGANA_STATE.code + pad2(district.code) + pad2(mandal.code) + pad2(village.code)

    // In Angular they call backend to get the last account in village. Here we just mock one.
    const mockLastAccNo = 1
    const accountNo =
      mockLastAccNo.toString().length === 1
        ? `${branchCode}000${mockLastAccNo}`
        : `0${(mockLastAccNo + 1).toString()}`

    setValue('branchCode', branchCode, { shouldValidate: true })
    setValue('accountNo', accountNo, { shouldValidate: true })
    setGenerated(true)
  }

  const onSubmit = (data: NewAccountFormValues) => {
    // Client-side equivalent of Angular required checks
    const missingDocuments =
      !data.passportImageId ||
      !data.signature1ImageId ||
      !data.signature2ImageId ||
      !data.document1ImageId ||
      !data.document2ImageId

    if (missingDocuments) {
      alert('Please upload Photo, both Signatures and both Documents before submitting.')
      return
    }

    if (!data.stateCode || !data.districtId || !data.mandalId || !data.villageId) {
      alert('Please fill location details and generate account details.')
      return
    }

    if (
      !data.date ||
      !data.applicantName ||
      !data.applicantSurname ||
      !data.gender ||
      !data.dob ||
      !data.age ||
      !data.accountType ||
      !data.accountCategory ||
      !data.shareType ||
      !data.smsAlert ||
      !data.fatherOrHusbandName ||
      !data.motherName ||
      !data.nomineeName ||
      !data.voterId ||
      !data.aadhar ||
      !data.rationCard ||
      !data.flatNo ||
      !data.streetName ||
      !data.villageAddress ||
      !data.mandalAddress ||
      !data.districtAddress ||
      !data.pinCode ||
      !data.mobileNumber ||
      !data.email ||
      !data.amount ||
      !data.employeeName
    ) {
      alert('Please fill all required fields before submitting.')
      return
    }

    if (Number(data.age) < 18) {
      alert('Age should be above 18 years.')
      return
    }

    // Nominee must be either father/husband or mother name as per Angular logic
    if (data.nomineeName) {
      const nominee = data.nomineeName.trim().toLowerCase()
      const father = data.fatherOrHusbandName.trim().toLowerCase()
      const mother = data.motherName.trim().toLowerCase()
      if (nominee !== father && nominee !== mother) {
        alert('Nominee name must match either Father/Husband or Mother name.')
        return
      }
    }

    if (data.nomineeRelationship) {
      const rel = data.nomineeRelationship.trim().toLowerCase()
      if (rel !== 'father' && rel !== 'mother' && rel !== 'husband') {
        alert('Nominee relationship must be Father, Mother or Husband.')
        return
      }
    }

    if (!generated) {
      alert('Please generate account details first.')
      return
    }
    // For now just log. Later we will call /nodejs/bankaccount/add_bankaccount
    // with a payload shaped like BankAccountModel.
    // eslint-disable-next-line no-console
    console.log('New account submit', data)
    alert('Form submitted (mock). When backend is wired, this will create a new account.')
  }

  const handleDobChange = (value: string) => {
    setValue('dob', value)
    if (!value) {
      setValue('age', '')
      return
    }
    const parts = value.split('-')
    if (parts.length !== 3) return
    const [year, month, day] = parts.map((p) => parseInt(p, 10))
    const dob = new Date(year, month - 1, day)
    if (Number.isNaN(dob.getTime())) return
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const m = today.getMonth() - dob.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age -= 1
    }
    setValue('age', String(age))
  }

  type UploadKind = 'passport' | 'signature1' | 'signature2' | 'document1' | 'document2'

  const fieldMap: Record<UploadKind, keyof NewAccountFormValues> = {
    passport: 'passportImageId',
    signature1: 'signature1ImageId',
    signature2: 'signature2ImageId',
    document1: 'document1ImageId',
    document2: 'document2ImageId',
  }

  const handleFileDrop = (kind: UploadKind) => (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    const refId = `TEMP_${kind}_${Date.now()}`
    const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    setUploads((prev) => ({
      ...prev,
      [kind]: { file, preview, refId },
    }))
    setValue(fieldMap[kind], refId, { shouldValidate: true })
  }

  useEffect(
    () => () => {
      // cleanup previews
      Object.values(uploads).forEach((u) => {
        if (u?.preview) {
          URL.revokeObjectURL(u.preview)
        }
      })
    },
    [uploads],
  )

  function UploadTile({
    label,
    kind,
  }: {
    label: string
    kind: UploadKind
  }) {
    const current = uploads[kind]
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: handleFileDrop(kind),
      multiple: false,
    })

    return (
      <Box
        sx={{
          borderRadius: 2,
          border: '1px dashed #cbd5e1',
          p: 1.5,
          textAlign: 'center',
          backgroundColor: '#f9fafb',
        }}
      >
        <Typography variant="caption" display="block" sx={{ mb: 0.5, fontWeight: 500 }}>
          {label}
        </Typography>
        <Box
          {...getRootProps()}
          sx={{
            cursor: 'pointer',
            borderRadius: 1.5,
            border: '1px solid #e5e7eb',
            py: 1.5,
            px: 1,
            backgroundColor: '#ffffff',
            '&:hover': { borderColor: '#60a5fa' },
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="caption" color="text.secondary">
            {current
              ? current.file.name
              : isDragActive
                ? 'Drop file here'
                : 'Click or drag file to upload'}
          </Typography>
        </Box>
        {current?.preview && (
          <Box
            component="img"
            src={current.preview}
            alt={label}
            sx={{ mt: 1, maxHeight: 80, maxWidth: '100%', objectFit: 'cover', borderRadius: 1 }}
          />
        )}
      </Box>
    )
  }

  return (
    <div className="page">
      <Typography variant="h5" gutterBottom>
        Account Opening Form
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Use this form to open a new member account. This mirrors the Angular & Node.js flow but
        currently submits locally only.
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Location & Branch
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Controller
                  name="stateCode"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      size="small"
                      fullWidth
                      label="State"
                      disabled
                      helperText="State is fixed to Telangana"
                    >
                      <MenuItem value={TELANGANA_STATE.code}>{TELANGANA_STATE.name}</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="districtId"
                  control={control}
                  rules={{ required: 'District is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      size="small"
                      fullWidth
                      label="District"
                      error={Boolean(errors.districtId)}
                      helperText={errors.districtId?.message}
                    >
                      {MOCK_DISTRICTS.map((d) => (
                        <MenuItem key={d.id} value={d.id}>
                          {d.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="mandalId"
                  control={control}
                  rules={{ required: 'Mandal is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      size="small"
                      fullWidth
                      label="Mandal"
                      error={Boolean(errors.mandalId)}
                      helperText={
                        errors.mandalId?.message ?? (selectedDistrictId ? '' : 'Select district first')
                      }
                    >
                      {availableMandals.map((m) => (
                        <MenuItem key={m.id} value={m.id}>
                          {m.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="villageId"
                  control={control}
                  rules={{ required: 'Village is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      size="small"
                      fullWidth
                      label="Village"
                      error={Boolean(errors.villageId)}
                      helperText={
                        errors.villageId?.message ?? (selectedMandalId ? '' : 'Select mandal first')
                      }
                    >
                      {availableVillages.map((v) => (
                        <MenuItem key={v.id} value={v.id}>
                          {v.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" size="small" onClick={onGenerateAccountDetails}>
                  Generate Account Details
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="branchCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Branch Code"
                      InputProps={{ readOnly: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="accountNo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Account Number"
                      InputProps={{ readOnly: true }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
                <Controller
                  name="applicantName"
                  control={control}
                  rules={{ required: 'Applicant name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Applicant Name"
                      error={Boolean(errors.applicantName)}
                      helperText={errors.applicantName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="applicantSurname"
                  control={control}
                  rules={{ required: 'Applicant surname is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Applicant Surname"
                      error={Boolean(errors.applicantSurname)}
                      helperText={errors.applicantSurname?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl size="small" component="fieldset">
                  <FormLabel component="legend">Gender</FormLabel>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: 'Gender is required' }}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel value="Male" control={<Radio size="small" />} label="Male" />
                        <FormControlLabel
                          value="Female"
                          control={<Radio size="small" />}
                          label="Female"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.gender && (
                    <Typography variant="caption" color="error">
                      {errors.gender.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="dob"
                  control={control}
                  rules={{ required: 'Date of birth is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      size="small"
                      fullWidth
                      label="Date of Birth"
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.dob)}
                      helperText={errors.dob?.message}
                      onChange={(e) => handleDobChange(e.target.value)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Age"
                      InputProps={{ readOnly: true }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl size="small" component="fieldset">
                  <FormLabel component="legend">Type of Account</FormLabel>
                  <Controller
                    name="accountType"
                    control={control}
                    rules={{ required: 'Account type is required' }}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value="Current"
                          control={<Radio size="small" />}
                          label="Current"
                        />
                        <FormControlLabel
                          value="Savings"
                          control={<Radio size="small" />}
                          label="Savings"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.accountType && (
                    <Typography variant="caption" color="error">
                      {errors.accountType.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl size="small" component="fieldset">
                  <FormLabel component="legend">Account Category</FormLabel>
                  <Controller
                    name="accountCategory"
                    control={control}
                    rules={{ required: 'Account category is required' }}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value="Individual"
                          control={<Radio size="small" />}
                          label="Individual"
                        />
                        <FormControlLabel
                          value="Joint"
                          control={<Radio size="small" />}
                          label="Joint"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.accountCategory && (
                    <Typography variant="caption" color="error">
                      {errors.accountCategory.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl size="small" component="fieldset">
                  <FormLabel component="legend">Type of Share</FormLabel>
                  <Controller
                    name="shareType"
                    control={control}
                    rules={{ required: 'Share type is required' }}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value="Single"
                          control={<Radio size="small" />}
                          label="Single"
                        />
                        <FormControlLabel
                          value="Double"
                          control={<Radio size="small" />}
                          label="Double"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.shareType && (
                    <Typography variant="caption" color="error">
                      {errors.shareType.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl size="small" component="fieldset">
                  <FormLabel component="legend">SMS Alert</FormLabel>
                  <Controller
                    name="smsAlert"
                    control={control}
                    rules={{ required: 'SMS alert preference is required' }}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                      </RadioGroup>
                    )}
                  />
                  {errors.smsAlert && (
                    <Typography variant="caption" color="error">
                      {errors.smsAlert.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Family & Identity
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="fatherOrHusbandName"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Father / Husband Name" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="motherName"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Mother Name" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="nomineeName"
                  control={control}
                  rules={{
                    validate: (value) => {
                      if (!value) return true
                      const nominee = value.trim().toLowerCase()
                      const father = getValues('fatherOrHusbandName').trim().toLowerCase()
                      const mother = getValues('motherName').trim().toLowerCase()
                      return (
                        nominee === father ||
                        nominee === mother ||
                        'Nominee must be Father/Husband or Mother.'
                      )
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Nominee Name"
                      error={Boolean(errors.nomineeName)}
                      helperText={errors.nomineeName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="nomineeRelationship"
                  control={control}
                  rules={{
                    validate: (value) => {
                      if (!value) return true
                      const rel = value.trim().toLowerCase()
                      return (
                        rel === 'father' ||
                        rel === 'mother' ||
                        rel === 'husband' ||
                        'Relationship must be Father, Mother or Husband.'
                      )
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Nominee Relationship"
                      error={Boolean(errors.nomineeRelationship)}
                      helperText={errors.nomineeRelationship?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="voterId"
                  control={control}
                  rules={{
                    required: 'Voter ID is required',
                    pattern: {
                      value: VOTER_ID_REGEX,
                      message: 'Please enter a valid Voter ID.',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Voter ID Number"
                      error={Boolean(errors.voterId)}
                      helperText={errors.voterId?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="aadhar"
                  control={control}
                  rules={{
                    required: 'Aadhar number is required',
                    pattern: {
                      value: AADHAR_REGEX,
                      message: 'Please enter a valid Aadhar number.',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Aadhar Number"
                      error={Boolean(errors.aadhar)}
                      helperText={errors.aadhar?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="rationCard"
                  control={control}
                  rules={{
                    required: 'Ration card number is required',
                    pattern: {
                      value: RATION_CARD_REGEX,
                      message: 'Please enter a valid Ration Card number.',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Ration Card Number"
                      error={Boolean(errors.rationCard)}
                      helperText={errors.rationCard?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Contact & Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="flatNo"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="House / Flat No" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="streetName"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Street Name" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="villageAddress"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Village Name" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="mandalAddress"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="Mandal Name" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="districtAddress"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} size="small" fullWidth label="District Name" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="pinCode"
                  control={control}
                  rules={{
                    required: 'Pin code is required',
                    pattern: {
                      value: PINCODE_REGEX,
                      message: 'Please enter a valid Pin code.',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Pin Code"
                      error={Boolean(errors.pinCode)}
                      helperText={errors.pinCode?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="mobileNumber"
                  control={control}
                  rules={{
                    required: 'Mobile number is required',
                    pattern: {
                      value: MOBILE_REGEX,
                      message: 'Please enter a valid mobile number.',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Mobile Number"
                      error={Boolean(errors.mobileNumber)}
                      helperText={errors.mobileNumber?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: EMAIL_REGEX,
                      message: 'Please enter a valid email address.',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Email"
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Amount & Employee
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="employeeName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Account Opening Employee"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="amount"
                  control={control}
                  rules={{ required: 'Deposit amount is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label="Amount to be Deposited"
                      type="number"
                      error={Boolean(errors.amount)}
                      helperText={errors.amount?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Documents
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <UploadTile label="Photo Upload" kind="passport" />
              </Grid>
              <Grid item xs={12} md={3}>
                <UploadTile label="Signature 1 Upload" kind="signature1" />
              </Grid>
              <Grid item xs={12} md={3}>
                <UploadTile label="Signature 2 Upload" kind="signature2" />
              </Grid>
              <Grid item xs={12} md={3}>
                <UploadTile label="Document 1 Upload" kind="document1" />
              </Grid>
              <Grid item xs={12} md={3}>
                <UploadTile label="Document 2 Upload" kind="document2" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', mt: 1 }}>
          <Button type="submit" variant="contained">
            Save &amp; Submit
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() => window.location.reload()}
          >
            Clear
          </Button>
        </Box>
      </Box>
    </div>
  )
}

