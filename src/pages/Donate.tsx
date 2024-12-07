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

interface DonationDetails {
  amount: string
  name: string
  email: string
  message: string
}

const Donate = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [donationDetails, setDonationDetails] = useState<DonationDetails>({
    amount: "",
    name: "",
    email: "",
    message: ""
  })

  useEffect(() => {
    dispatch(updateDisplay({ displayPetBanner: false }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (field: keyof DonationDetails) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDonationDetails(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement API call to process donation
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulated API delay
      
      toast({
        title: "Thank You!",
        description: "Your donation has been processed successfully.",
      })

      setDonationDetails({
        amount: "",
        name: "",
        email: "",
        message: ""
      })
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again." + (error instanceof Error ? error.message : ""),
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-3">
      <h1 className="text-3xl font-bold mb-4">Make a Donation</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-full p-1">
          <CardHeader>
            <CardTitle>Support Our Cause</CardTitle>
            <p className="text-sm text-gray-500">
              Your donation helps us provide care for animals in need
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Donation Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={donationDetails.amount}
                  onChange={handleChange("amount")}
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  value={donationDetails.name}
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
                  value={donationDetails.email}
                  onChange={handleChange("email")}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={donationDetails.message}
                  onChange={handleChange("message")}
                  placeholder="Leave a message with your donation"
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Donate Now
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="h-full p-1">
          <CardHeader>
            <CardTitle>Why Donate?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Your donations help us:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide food and shelter for animals</li>
                <li>Cover medical expenses and treatments</li>
                <li>Support rescue operations</li>
                <li>Maintain our facilities</li>
                <li>Fund educational programs</li>
              </ul>
              <p className="mt-4 text-sm text-gray-500">
                All donations are tax-deductible. You will receive a receipt for your records.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Donate
