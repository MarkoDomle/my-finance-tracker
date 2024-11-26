import React, { useEffect, useRef } from 'react'
import { useTransactionsQuery } from '../hooks/useTransactions'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material'
import Chart from 'chart.js/auto'

const ReportsPage: React.FC = () => {
  const { data: transactions, isPending, isError } = useTransactionsQuery()
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (transactions) {
      const transactionsByLocation: { [location: string]: number } = {}

      transactions.forEach((transaction) => {
        const { location, amount, currency } = transaction
        const amountInMKD = convertToMKD(amount, currency)
        transactionsByLocation[location] =
          (transactionsByLocation[location] || 0) + amountInMKD
      })

      const locations = Object.keys(transactionsByLocation)
      const amounts = Object.values(transactionsByLocation)

      if (chartRef.current) {
        chartRef.current.destroy()
      }

      const ctx = document.getElementById('myChart') as HTMLCanvasElement
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: locations,
          datasets: [
            {
              label: 'Total Amount',
              data: amounts,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    }
  }, [transactions])

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error fetching data</div>

  const convertToMKD = (amount: number, currency: string) => {
    switch (currency) {
      case 'EURO':
        return amount * 61.5
      case 'USD':
        return amount * 52
      default:
        return amount
    }
  }

  let maxSpentLocation = ''
  let maxSpentAmount: number | null = null
  if (transactions) {
    const transactionsByLocation: { [location: string]: number } = {}

    transactions.forEach((transaction) => {
      const { location, amount, currency } = transaction
      const amountInMKD = convertToMKD(amount, currency)
      transactionsByLocation[location] =
        (transactionsByLocation[location] || 0) + amountInMKD
    })

    for (const [location, totalAmount] of Object.entries(
      transactionsByLocation,
    )) {
      if (maxSpentAmount === null || totalAmount > (maxSpentAmount || 0)) {
        maxSpentLocation = location
        maxSpentAmount = totalAmount
      }
    }
  }

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
        <Typography variant="h5">Reports Page</Typography>
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
                color: 'white', // Change text color to white on hover
              },
            }}
          >
            Home
          </Button>
          <Button
            variant="contained"
            href="/transactions"
            sx={{
              marginRight: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
              color: 'darkgreen', // Text color
              borderRadius: '12px', // Rounded corners
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slightly more opaque on hover
                color: 'white', // Change text color to white on hover
              },
            }}
          >
            Transactions
          </Button>
          <Button
            variant="contained"
            href="/budgets"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              color: 'darkgreen',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                color: 'white', // Change text color to white on hover
              },
            }}
          >
            Budgets
          </Button>
        </Box>
      </Box>

      <div style={{ display: 'flex', padding: '20px' }}>
        <div style={{ flex: '1' }}>
          <Typography variant="h6" gutterBottom>
            Location with the Most Money Spent
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Total Amount (MKD)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{
                    '&:hover': { backgroundColor: '#e0f7fa' },
                  }}
                >
                  <TableCell>{maxSpentLocation}</TableCell>
                  <TableCell>{maxSpentAmount?.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
            All Transactions Ordered by Money Spent
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount (MKD)</TableCell>
                  <TableCell>Paid in</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow
                    key={transaction.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                      '&:hover': { backgroundColor: '#e0f7fa' },
                    }}
                  >
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      {convertToMKD(
                        transaction.amount,
                        transaction.currency,
                      ).toFixed(2)}{' '}
                      (MKD)
                    </TableCell>
                    <TableCell>
                      {transaction.currency !== 'MKD' ? (
                        <span>
                          {transaction.amount.toFixed(2)} (
                          {transaction.currency})
                        </span>
                      ) : (
                        'MKD'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div style={{ flex: '1', marginLeft: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Chart: Amounts by Location
          </Typography>
          <canvas id="myChart" width="400" height="400"></canvas>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
