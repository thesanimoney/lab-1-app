'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { toast } from "sonner"

export default function SendMoneyModal() {
  const [open, setOpen] = useState(false)
  const [recipientCard, setRecipientCard] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipientCard || !amount) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    // Simulating an API call to send money
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success(`Successfully sent $${amount} to card ${recipientCard}`)
      setRecipientCard('')
      setAmount('')
      setOpen(false)
    } catch (error) {
      toast.error('Failed to send money. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
       <div className='flex items-center justify-between p-4 bg-gray-100 rounded-md'>
         <p className='text-lg font-semibold'>Who should we send money to today?</p>
         <Button size={'lg'} className='ml-4'>Send Money</Button>
       </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Money</DialogTitle>
          <DialogDescription>
            Enter the recipient's card details and the amount you want to send.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSendMoney}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipientCard" className="text-right">
                Card Number
              </Label>
              <Input
                id="recipientCard"
                placeholder="1234 5678 9012 3456"
                value={recipientCard}
                onChange={(e) => setRecipientCard(e.target.value.replace(/\s/g, '').slice(0, 16))}
                className="col-span-3"
                maxLength={16}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount ($)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="col-span-3"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Money'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}