'use client'

import { toast } from "sonner"
import { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { validateCardDetails } from "@/lib/actions/credsAuth"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  cardNumber: z.string().length(16, { message: "Card number must be 16 digits long." }),
  pin: z.string().length(4, { message: "PIN must be 4 digits long." }),
})

export default function BankAuthScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      pin: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const isValidated = await validateCardDetails(values.cardNumber, parseInt(values.pin))
      if (isValidated) {
        toast.success('Authentication successful!', {
          description: 'You have been securely logged in.',
        })
        router.push('/dashboard')
      } else {
        toast.error('Authentication failed!', {
          description: 'Please check your card number and PIN.',
        })
      }
    } catch (error) {
      toast.error('An error occurred', {
        description: 'Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Bank Authentication</CardTitle>
        <CardDescription>Enter your card details to authenticate</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="1234 5678 9012 3456"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN Code</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Authenticate"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">Your information is securely encrypted</p>
      </CardFooter>
    </Card>
  )
}