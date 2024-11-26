// hooks/useTransactions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type Transaction = {
  id: string
  description: string
  amount: number
  date: string
  category: string
  type: 'income' | 'expense' | 'transfer'
  notes?: string
  currency: string
  location: string
  paymentMethod?: string
}

const fetchTransactions = async () => {
  return new Promise<Transaction[]>((resolve) => {
    const data = localStorage.getItem('transactionsData')
    setTimeout(
      () =>
        resolve(
          data
            ? JSON.parse(data).map((transaction: Transaction) => ({
                ...transaction,
                date: new Date(transaction.date),
              }))
            : [],
        ),
      100,
    )
  })
}

const fetchTransaction = async (transactionId: string) => {
  const transactions = await fetchTransactions()
  return transactions.find((transaction) => transaction.id === transactionId)
}

const setDataToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const useTransactionsQuery = () => {
  return useQuery({
    queryKey: ['transactionsData'],
    queryFn: fetchTransactions,
  })
}

export const useTransactionQuery = (id: string) => {
  const query = useQuery({
    queryKey: ['transactionsData', id],
    queryFn: async () => {
      return fetchTransaction(id)
    },
  })

  return query
}

type CreateTransactionData = Omit<Transaction, 'id'>

export const useCreateTransactionMutation = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<Transaction, unknown, CreateTransactionData>({
    mutationFn: async (data) => {
      const newTransaction = { ...data, id: Date.now().toString() }
      const transactions = await fetchTransactions()
      const updatedTransactions = [...transactions, newTransaction]
      setDataToLocalStorage('transactionsData', updatedTransactions)

      return newTransaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactionsData'] })
    },
  })

  return mutation
}
