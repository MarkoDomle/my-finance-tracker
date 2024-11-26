import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  MenuItem,
  Grid,
  colors,
} from '@mui/material'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateTransactionMutation } from '../hooks/useTransactions'
import { useForm } from 'react-hook-form'

// Define the schema for form validation
const transactionSchema = z.object({
  description: z.string().min(1, { message: 'Description is required' }),
  amount: z
    .string()
    .min(1, { message: 'Amount is required' })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Amount must be a number',
    }),
  date: z.string().min(1, { message: 'Date is required' }), // Format: yyyy-MM-dd
  category: z.string().min(1, { message: 'Category is required' }),
  type: z.enum(['income', 'expense', 'transfer'], {
    required_error: 'Type is required',
  }),
  notes: z.string().optional(),
  currency: z.enum(['EURO', 'USD', 'MKD'], {
    required_error: 'Currency is required',
  }),
  location: z.string().min(1, { message: 'Location is required' }),
  paymentMethod: z.enum(['Cash', 'Credit Card'], {
    required_error: 'Payment Method is required',
  }),
})

type TransactionSchema = z.infer<typeof transactionSchema>

interface AddTransactionModalProps {
  open: boolean
  onClose: () => void
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionSchema>({
    defaultValues: {
      description: '',
      currency: 'MKD',
      category: '',
      location: '',
      notes: '',
      paymentMethod: 'Cash',
      date: new Date().toISOString().split('T')[0],
      type: 'income',
    },
    resolver: zodResolver(transactionSchema),
  })

  const createTransactionMutation = useCreateTransactionMutation()

  const handleAddTransaction = async (formData: TransactionSchema) => {
    try {
      await createTransactionMutation.mutateAsync({
        ...formData,
        amount: Number(formData.amount),
      })
      reset()
      onClose()
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: '600px' } }}
    >
      <DialogTitle sx={{ backgroundColor: 'darkgreen', color: 'white' }}>
        Add Transaction
        {/* Close Button */}
        <Button
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: '16px',
            top: '16px',
            color: 'white',
            '&:hover': { background: 'white', color: 'lightgray' },
          }}
        >
          X
        </Button>
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
        <form onSubmit={handleSubmit(handleAddTransaction)}>
          <Grid style={{ marginTop: '2px' }} container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Description"
                type="text"
                variant="outlined"
                fullWidth
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('date')}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Amount"
                type="number"
                variant="outlined"
                fullWidth
                {...register('amount')}
                error={!!errors.amount}
                helperText={errors.amount?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Currency"
                variant="outlined"
                fullWidth
                defaultValue="MKD"
                {...register('currency')}
                error={!!errors.currency}
                helperText={errors.currency?.message}
              >
                <MenuItem value="MKD">MKD</MenuItem>
                <MenuItem value="EURO">EURO</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Category"
                type="text"
                variant="outlined"
                fullWidth
                {...register('category')}
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Payment Method"
                variant="outlined"
                fullWidth
                defaultValue="Cash"
                {...register('paymentMethod')}
                error={!!errors.paymentMethod}
                helperText={errors.paymentMethod?.message}
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Credit Card">Credit Card</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Type"
                variant="outlined"
                fullWidth
                defaultValue="income"
                {...register('type')}
                error={!!errors.type}
                helperText={errors.type?.message}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
                <MenuItem value="transfer">Transfer</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Location"
                type="text"
                variant="outlined"
                fullWidth
                {...register('location')}
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: 'darkgreen',
                '&:hover': { backgroundColor: 'green' },
              }}
            >
              Add
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  )
}
