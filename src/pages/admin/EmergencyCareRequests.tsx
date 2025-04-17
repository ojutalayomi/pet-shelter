import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { PetProfile } from "@/types/type"
import { api } from "@/providers/fetch-details"
import { Time } from "@/lib/utils"

interface EmergencyRequest {
  _id: string
  petData: PetProfile
  ownerName: string
  phone: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

const timeInstance = new Time()

const EmergencyCareRequests = () => {
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await api.get('/pets/emergency-care?all=true')
      if (response.status === 200 && Array.isArray(response.data)) {
        setRequests(response.data)
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      toast({
        title: "Error", 
        description: "Failed to fetch emergency care requests",
        variant: "destructive"
      })
    }
  }

  const handleStatusUpdate = async (requestId: string, status: 'approved' | 'rejected') => {
    setIsLoading(true)
    try {
      const response = await api.put(`/pets/emergency-care/${requestId}`, { status })
      if (response.status === 200) {
        toast({
          title: "Status Updated",
          description: `Request ${status} successfully`,
        })
        fetchRequests()
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto py-6 px-3 space-y-4">
      <h1 className="text-2xl font-bold text-center w-full">Emergency Care Requests</h1>
      
      {requests.length === 0 ? (
        <p className="text-muted-foreground text-center w-full">No emergency care requests found.</p>
      ) : (
        Array.isArray(requests) && requests.map((request) => (
          <div key={request._id} className="bg-background border rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="border-b pb-4 mb-4">
              <h3 className="text-2xl font-semibold text-primary">
                Request for {request.petData.name}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-3 rounded-md">
                  <span className="text-sm text-muted-foreground">Owner</span>
                  <p className="font-medium">{request.ownerName}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-md">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <p className="font-medium">{request.phone}</p>
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md">
                <span className="text-sm text-muted-foreground">Description</span>
                <p className="font-medium">{request.description}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {timeInstance.formatMoment(request.createdAt)}
                </div>
              </div>
              
              {request.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t mt-4">
                  <Button 
                    onClick={() => handleStatusUpdate(request._id, 'approved')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleStatusUpdate(request._id, 'rejected')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default EmergencyCareRequests
