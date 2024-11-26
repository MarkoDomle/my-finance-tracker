import React, { useState } from 'react'
import { useTransactionsQuery } from '../hooks/useTransactions'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from '@mui/material'
import { format } from 'date-fns'
import { AddTransactionModal } from '../components/AddTransactionModal'

const TransactionsPage: React.FC = () => {
  const { data, isPending, isError } = useTransactionsQuery()
  const [isModalShown, setIsModalShown] = useState(false)

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error fetching data</div>

  return (
    <div>
      {/* Header with title and buttons */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          backgroundColor: 'darkgreen',
          color: 'white',
          padding: '10px 20px',
        }}
      >
        <Typography variant="h5">Transactions Page</Typography>
        <Box>
          <Button
            variant="contained"
            href="/home"
            sx={{
              marginRight: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              color: 'darkgreen',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                color: 'white',
              },
            }}
          >
            Home
          </Button>
          <Button
            variant="contained"
            href="/budgets"
            sx={{
              marginRight: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
              color: 'darkgreen', // Text color
              borderRadius: '12px', // Rounded corners
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slightly more opaque on hover
                color: 'white', // Change text color on hover
              },
            }}
          >
            Budgets
          </Button>

          <Button
            variant="contained"
            href="/reports"
            sx={{
              marginRight: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              color: 'darkgreen',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                color: 'white',
              },
            }}
          >
            Reports
          </Button>
        </Box>
      </Box>
      <Button
        onClick={() => setIsModalShown(true)}
        variant="contained"
        sx={{
          marginTop: 3,
          marginRight: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          color: 'darkgreen',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
          },
        }}
      >
        Add Transaction
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Payment Method</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((transaction, index) => (
              <TableRow
                key={transaction.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white', // Alternate row colors
                  '&:hover': { backgroundColor: '#e0f7fa' }, // Hover effect
                }}
              >
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{format(transaction.date, 'yyyy-MM-dd')}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.currency}</TableCell>
                <TableCell>{transaction.location}</TableCell>
                <TableCell>{transaction.paymentMethod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddTransactionModal
        open={isModalShown}
        onClose={() => setIsModalShown(false)}
      />
    </div>
  )
}

export default TransactionsPage
