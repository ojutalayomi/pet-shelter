import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updateDisplay } from "@/redux/settingsSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { api } from "@/providers/fetch-details"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

interface VisitDetails {
  date: string
  time: string
  name: string
  email: string
  phone: string
  notes: string
}

const ScheduleVisit = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.user)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [visitDetails, setVisitDetails] = useState<VisitDetails>({
    date: "",
    time: "",
    name: `${user.firstName } ${user.lastName}`,
    email: user.email,
    phone: "",
    notes: ""
  })

  useEffect(() => {
    dispatch(updateDisplay({ displayPetBanner: false }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (field: keyof VisitDetails) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(e.target.value)
    setVisitDetails(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { date, time, ...rest } = visitDetails
      const combinedDateTime = new Date(`${date}, ${time}`).toISOString()
      const response = await api.post('/users/schedule-visit', { ...rest, visitDateAndTime: combinedDateTime })
      if(response.status === 200) {
        toast({
          title: "Visit Scheduled",
          description: "Your visit has been successfully scheduled. We'll contact you soon.",
        })
        setVisitDetails({
          date: "",
          time: "",
          name: "",
          email: "",
          phone: "",
          notes: ""
        })
      }
      
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to schedule visit. Please try again." + (error instanceof Error ? error.message : ""),
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-full p-1">
      <CardHeader>
        <CardTitle>Schedule a Visit</CardTitle>
        <p className="text-sm text-gray-500">
          Fill out the form below to schedule a visit to meet our pets
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Date</Label>
              <Input
                id="date"
                type="date"
                required
                value={visitDetails.date}
                onChange={handleChange("date")}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Input
                id="time"
                type="time"
                required
                value={visitDetails.time}
                onChange={handleChange("time")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                value={visitDetails.name}
                onChange={handleChange("name")}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={visitDetails.email}
                onChange={handleChange("email")}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={visitDetails.phone}
                onChange={handleChange("phone")}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={visitDetails.notes}
              onChange={handleChange("notes")}
              placeholder="Any specific requirements or questions?"
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Schedule Visit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ScheduleVisit
