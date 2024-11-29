import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { updateDisplay } from "@/redux/settingsSlice"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const AdoptionProcess = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(updateDisplay({ displayPetBanner: false }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container mx-auto px-6 py-3">
      <h1 className="text-3xl font-bold mb-6">Adoption Process</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1. Application Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              Submit your adoption application for review. We'll check your:
              <ul className="list-disc ml-6 mt-2">
                <li>Personal information and references</li>
                <li>Living situation and environment</li>
                <li>Previous pet ownership experience</li>
                <li>Work schedule and lifestyle</li>
              </ul>
            </div>
            <Link to="/adoption-applications">
              <Button className="mt-4">View Applications</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Meet and Greet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              Schedule a visit to meet your potential pet. During this time:
              <ul className="list-disc ml-6 mt-2">
                <li>Interact with the pet in person</li>
                <li>Ask questions about their history</li>
                <li>Learn about their specific needs</li>
                <li>Ensure it's a good match for both parties</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Home Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              We'll conduct a brief home visit to ensure:
              <ul className="list-disc ml-6 mt-2">
                <li>Safe and suitable living environment</li>
                <li>Proper fencing/security if applicable</li>
                <li>Family member agreement</li>
                <li>Preparation for pet arrival</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Final Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              Once approved, you'll need to:
              <ul className="list-disc ml-6 mt-2">
                <li>Pay adoption fees</li>
                <li>Sign adoption contract</li>
                <li>Schedule pick-up date</li>
                <li>Receive care instructions and medical records</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Basic Requirements</h3>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Must be 18 years or older</li>
                  <li>Valid government-issued ID</li>
                  <li>Proof of residence</li>
                  <li>Landlord approval (if renting)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Financial Requirements</h3>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Adoption fee payment</li>
                  <li>Ability to provide veterinary care</li>
                  <li>Resources for food and supplies</li>
                  <li>Emergency fund for unexpected care</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdoptionProcess
