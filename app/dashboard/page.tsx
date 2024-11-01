'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import NearbyATMs from '@/components/near-atms'
import SendMoneyModal from '@/components/send-money'
type Transaction = {
  id: number
  date: Date
  amount: number
  type: 'deposit' | 'withdrawal'
}

const generateTransactionHistory = (): Transaction[] => {
  const now = new Date()
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const transactions: Transaction[] = []

  for (let i = 0; i < 20; i++) {
    const date = new Date(oneMonthAgo.getTime() + Math.random() * (now.getTime() - oneMonthAgo.getTime()))
    transactions.push({
      id: i + 1,
      date,
      amount: Math.floor(Math.random() * 1000) + 1,
      type: Math.random() > 0.5 ? 'deposit' : 'withdrawal'
    })
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export default function Dashboard() {
  const [balance, setBalance] = useState(3560)
  const [transactions, setTransactions] = useState<Transaction[]>(generateTransactionHistory())
  const [sortPeriod, setSortPeriod] = useState('all')
  const [amount, setAmount] = useState('')
  const [showBalance, setShowBalance] = useState(false)
  const [showCardNumber, setShowCardNumber] = useState(false)

  const handleAddMoney = () => {
    if (amount && !isNaN(Number(amount))) {
      const newAmount = Number(amount)
      setBalance(balance + newAmount)
      addTransaction(newAmount, 'deposit')
      toast.success(`Successfully added $${newAmount}`)
      setAmount('')
    } else {
      toast.error('Please enter a valid amount')
    }
  }

  const handleWithdrawMoney = () => {
    if (amount && !isNaN(Number(amount))) {
      const newAmount = Number(amount)
      if (newAmount <= balance) {
        setBalance(balance - newAmount)
        addTransaction(newAmount, 'withdrawal')
        toast.success(`Successfully withdrawn $${newAmount}`)
        setAmount('')
      } else {
        toast.error('Insufficient funds')
      }
    } else {
      toast.error('Please enter a valid amount')
    }
  }

  const addTransaction = (amount: number, type: 'deposit' | 'withdrawal') => {
    const newTransaction: Transaction = {
      id: Date.now(),
      date: new Date(),
      amount,
      type
    }
    setTransactions([newTransaction, ...transactions])
  }

  const filteredTransactions = useMemo(() => {
    const now = new Date()
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      switch (sortPeriod) {
        case 'day':
          return transactionDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return transactionDate >= weekAgo
        case 'month':
          return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }, [transactions, sortPeriod])

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Bank Dashboard</CardTitle>
            <CardDescription>Welcome, Oleksandr Stoliarchuk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="col-span-3">
              <div>
                <strong>Card Number:</strong> {showCardNumber ? '1234 5678 9012 3456' : '**** **** **** 1234'}
                <Button onClick={() => setShowCardNumber(!showCardNumber)} variant="outline" className="ml-2">
                  {showCardNumber ? 'Hide' : 'Show'}
                </Button>
              </div>
              <div>
                <strong>Balance:</strong> ${balance.toFixed(2)}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button onClick={handleAddMoney}>Add Money</Button>
              <Button onClick={handleWithdrawMoney} variant="outline">Withdraw</Button>
            </div>
          </CardFooter>
        </Card>
        <NearbyATMs />
      </div>
      <div>
      <SendMoneyModal/>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <div className="flex justify-between items-center">
            <CardDescription>Recent transactions</CardDescription>
            <Select value={sortPeriod} onValueChange={setSortPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date.toLocaleString()}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell className="text-right">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}