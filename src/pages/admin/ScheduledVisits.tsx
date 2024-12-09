import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Users } from 'lucide-react'
import { api } from '@/providers/fetch-details'
import { toast } from '@/hooks/use-toast'
import { Time } from '@/lib/utils';

interface ScheduledVisit {
  _id: string
  userId: string
  name: string
  email: string
  visitDateAndTime: string
  notes: string
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

const timeInstance = new Time()

const ScheduledVisits = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [visits, setVisits] = useState<ScheduledVisit[]>([])

  const fetchVisits = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/users/list-visits', {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      })
      setVisits(response.data)
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch scheduled visits'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Calendar className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Scheduled Visits</h1>
            <p className="text-muted-foreground">View and manage all scheduled visits</p>
          </div>
        </div>
        <Button
          onClick={fetchVisits}
          disabled={isLoading}
        >
          Refresh Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No scheduled visits found</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {visits.map((visit) => (
                  <li 
                    key={visit._id}
                    className="flex items-center justify-between py-4"
                  >
                    <div>
                      <p className="font-medium">{visit.name}</p>
                      <p className="text-sm text-muted-foreground">{visit.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {timeInstance.formatMoment(visit.visitDateAndTime)}
                      </p>
                      <p className="text-sm text-muted-foreground">Status: {visit.status}</p>
                      {visit.notes && (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">Notes: {visit.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ScheduledVisits
