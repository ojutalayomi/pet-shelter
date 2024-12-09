import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"
import { api } from "@/providers/fetch-details"
import { useToast } from "@/hooks/use-toast"

const DonateSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isVerifying, setIsVerifying] = useState(true)
  const reference = searchParams.get("reference")

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        navigate("/donate")
        return
      }

      try {
        const response = await api.get(
          `/payment/verify/${reference}`
        )

        if (response.data.status) {
          toast({
            title: "Thank you for your donation!",
            description: "Your payment has been successfully processed.",
          })
        }
      } catch (error) {
        console.error("Payment verification error:", error)
        toast({
          title: "Verification Failed",
          description: "There was an error verifying your payment.",
          variant: "destructive"
        })
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [reference, navigate, toast])

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-center text-muted-foreground">
              Verifying your donation...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Donation Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your generous donation. Your support helps us continue our
            mission of helping animals in need.
          </p>
          <p className="text-sm text-muted-foreground">
            Reference: {reference}
          </p>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              Return Home
            </Button>
            <Button onClick={() => navigate("/donate")}>Donate Again</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DonateSuccess
