import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { api } from "@/providers/fetch-details"
import { useNavigate } from "react-router-dom"

interface DonationDetails {
  amount: string
  name: string
  email: string
  message: string
}

const Donate = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [donationDetails, setDonationDetails] = useState<DonationDetails>({
    amount: "",
    name: "",
    email: "",
    message: ""
  })
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  
  const backgrounds = [
    'bg-[url("/paws.jpg")]',
    'bg-[url("/kitten.jpg")]',
    'bg-[url("/dog-454145_1920.jpg")]',
    'bg-[url("/rabbit-8489271_1920.png")]',
    'bg-[url("/dog-2606759_1920.jpg")]',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // Initialize payment
      const response = await api.post(`/donations/payment/initialize`, {
        amount: parseFloat(donationDetails.amount),
        email: donationDetails.email,
        metadata: {
          name: donationDetails.name,
          message: donationDetails.message
        }
      })

      // Redirect to Paystack checkout
      window.location.href = response.data.data.authorization_url

    } catch (error) {
      console.error('Payment initialization error:', error)
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`
      relative min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8
      before:absolute before:inset-0 before:z-0
      ${backgrounds[currentBgIndex]} bg-cover bg-center bg-fixed
      before:bg-gradient-to-b before:from-background/95 before:to-background/70
      transition-[background-image] duration-1000
    `}>
      <div className="relative z-10 max-w-7xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-4xl font-bold mb-8 text-center">Make a Donation</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="backdrop-blur-sm bg-background/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Support Our Cause</CardTitle>
              <p className="text-muted-foreground">
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Donate Now'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-background/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Why Donate?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-lg font-medium">Your donations help us:</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    Provide food and shelter for animals
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    Cover medical expenses and treatments
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    Support rescue operations
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    Maintain our facilities
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    Fund educational programs
                  </li>
                </ul>
                <div className="rounded-lg bg-muted p-4 mt-6">
                  <p className="text-sm text-muted-foreground">
                    All donations are tax-deductible. You will receive a receipt for your records.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Donate
