'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin } from 'lucide-react'
import Link from 'next/link'
import { ScrollArea } from "@/components/ui/scroll-area"

type ATM = {
  id: string
  name: string
  address: string
  distance: number
}

const mockATMs: ATM[] = [
  { id: '1', name: 'Central Square ATM', address: '123 Main St, City Center', distance: 0.5 },
  { id: '2', name: 'Shopping Mall ATM', address: '456 Market Ave, Downtown', distance: 1.2 },
  { id: '3', name: 'University Campus ATM', address: '789 College Rd, Uptown', distance: 2.3 },
  { id: '4', name: 'Train Station ATM', address: '101 Railway St, Midtown', distance: 3.1 },
]

export default function NearbyATMs() {
  const [atms, setATMs] = useState<ATM[]>([])
  const [loading, setLoading] = useState(false)

  const findNearbyATMs = () => {
    setLoading(true)
    // Simulating an API call to fetch nearby ATMs
    setTimeout(() => {
      setATMs(mockATMs)
      setLoading(false)
    }, 1500)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Nearby ATMs</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={findNearbyATMs} disabled={loading} className="w-full mb-4">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding ATMs...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Find Nearby ATMs
            </>
          )}
        </Button>
        {atms.length > 0 && (
            <ScrollArea className="h-[150px] rounded-md border p-4">
          <ul className="space-y-2">
            {atms.map((atm) => (
              <li key={atm.id} className="border-b pb-2">
                <h3 className="font-semibold">{atm.name}</h3>
                <a href={`https://www.google.com/maps/place/London,+UK/@51.5287393,-0.2667471,11z/data=!3m1!4b1!4m6!3m5!1s0x47d8a00baf21de75:0x52963a5addd52a99!8m2!3d51.5072178!4d-0.1275862!16zL20vMDRqcGw?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D`}>
                  <p className="text-sm text-gray-600">{atm.address}</p>
                </a>
                <p className="text-sm text-gray-500">{atm.distance.toFixed(1)} km away</p>
              </li>
            ))}
          </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}