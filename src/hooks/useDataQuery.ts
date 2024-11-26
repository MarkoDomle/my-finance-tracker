// src/hooks/useDataQuery.ts
import { useQuery } from '@tanstack/react-query'

const getDataFromLocalStorage = (key: string) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

export const useDataQuery = () => {
  const query = useQuery({
    queryKey: ['homeData'],
    queryFn: async () => {
      const data = getDataFromLocalStorage('homeData')
      if (!data) {
        throw new Error(`Data for key 'homeData' not found in localStorage`)
      }
      return data
    },
  })

  return query
}
// import { useQuery } from '@tanstack/react-query'

// const getDataFromLocalStorage = (key: string) => {
//   const data = localStorage.getItem(key)
//   return data ? JSON.parse(data) : null
// }

// export const useDataQuery = () => {
//   const query = useQuery({
//     queryKey: ['homeData'],
//     queryFn: async () => {
//       const data = getDataFromLocalStorage('homeData')
//       if (!data) {
//         // Set default data if not found
//         const defaultData = { transactions: [], budget: 1000 } // Replace with your default structure
//         localStorage.setItem('homeData', JSON.stringify(defaultData))
//         return defaultData
//       }
//       return data
//     },
//   })

//   return query
// }
