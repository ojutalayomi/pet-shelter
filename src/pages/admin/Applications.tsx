import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BadgeAlert, BadgeCheck, BadgeHelp, InboxIcon, Download, Loader2 } from 'lucide-react';
import { Time } from '@/lib/utils';
import { AdoptionApplicationDetailsForAdmin } from '@/types/type';
import { api } from "@/providers/fetch-details"
import { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { updateAdoptionApplicationForAdmin } from '@/redux/petSlice';
import { Textarea } from '@/components/ui/textarea';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const timeInstance = new Time();

const Applications = () => {
  const { applications, pagination } = useSelector((state: RootState) => state.pet.adoptionApplicationListForAdmin);
  const pets = useSelector((state: RootState) => state.pet.petData.pets);
  const [page, setPage] = useState(1);
  const itemsPerPage = pagination.itemsPerPage;
  const [isLoading, setIsLoading] = useState(false);
  const applicationRef = useRef<HTMLDivElement>(null);

  const generatePDF = async (application: AdoptionApplicationDetailsForAdmin) => {
    setIsLoading(true);
    // Create a temporary div to render the content
    const printElement = document.createElement('div');
    printElement.className = 'pdf-content p-8';
    
    // Add your styled HTML content
    printElement.innerHTML = `
      <div class="space-y-6">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold">Adoption Application Details</h1>
          <p class="text-sm text-gray-500">Application ID: ${application._id}</p>
          <p class="text-sm text-gray-500">Generated on ${new Date().toLocaleString()}</p>
        </div>

        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Applicant Information</h2>
          <div class="grid grid-cols-2 gap-4">
            <p><span class="font-medium">Name:</span> ${application.firstName} ${application.lastName}</p>
            <p><span class="font-medium">Email:</span> ${application.email}</p>
            <p><span class="font-medium">Phone:</span> ${application.phone}</p>
            <p><span class="font-medium">Address:</span> ${application.address}, ${application.city}, ${application.state} ${application.zip}</p>
          </div>
        </div>

        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Pet Information</h2>
          <div class="grid grid-cols-2 gap-4">
            ${(() => {
              const pet = pets.find(p => p.id === application.petId);
              return pet ? `
                <p><span class="font-medium">Name:</span> ${pet.name}</p>
                <p><span class="font-medium">Pet ID:</span> ${pet.id}</p>
                <p><span class="font-medium">Type:</span> ${pet.type}</p>
                <p><span class="font-medium">Breed:</span> ${pet.breed}</p>
                <p><span class="font-medium">Age:</span> ${pet.age} year(s)</p>
              ` : `<p><span class="font-medium">Pet ID:</span> ${application.petId}</p>`;
            })()}
          </div>
        </div>

        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Housing Information</h2>
          <div class="grid grid-cols-2 gap-4">
            <p><span class="font-medium">Housing Type:</span> ${application.housing}</p>
            <p><span class="font-medium">Own/Rent:</span> ${application.ownRent}</p>
            ${application.landlordContact ? `<p><span class="font-medium">Landlord Contact:</span> ${application.landlordContact}</p>` : ''}
          </div>
        </div>

        ${application.notes ? `
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Notes</h2>
            <p class="whitespace-pre-wrap">${application.notes}</p>
          </div>
        ` : ''}

        <div class="mt-8 pt-4 border-t">
          <p class="text-sm text-gray-500">Application Status: ${application.status}</p>
          <p class="text-sm text-gray-500">Submitted: ${timeInstance.formatMoment(application.createdAt)}</p>
          <p class="text-sm text-gray-500">Last Updated: ${timeInstance.formatMoment(application.updatedAt)}</p>
        </div>
      </div>
    `;

    // Append to document temporarily
    document.body.appendChild(printElement);

    try {
      // Convert HTML to canvas
      const canvas = await html2canvas(printElement, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image to PDF
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Save the PDF
      pdf.save(`adoption-application-${application.firstName}-${application.lastName}.pdf`);
    } finally {
      // Clean up
      document.body.removeChild(printElement);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Adoption Applications</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <InboxIcon className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No applications to display</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {applications
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((application) => (
                    <div 
                      key={application._id} 
                      ref={applicationRef}
                      className="flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex flex-wrap items-center gap-4">
                        <Avatar className="border p-1 rounded-full">
                          <AvatarFallback className="p-1">
                            {application.firstName[0]}{application.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">
                            {application.firstName} {application.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {application.email}
                          </p>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center gap-2">
                                {
                                  application.status === 'rejected' ? <BadgeAlert className="h-6 w-6 text-red-500"/> :
                                  application.status === 'approved' ? <BadgeCheck className="h-6 w-6 text-green-500"/> :
                                  application.status === 'needs more info' ? <BadgeHelp className="h-6 w-6 text-yellow-500"/> :
                                  <BadgeHelp className="h-6 w-6 text-yellow-500"/>
                                }
                                <span className="text-xs font-medium capitalize">
                                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Application {application.status}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium">Pet Details</p>
                          <div className="text-sm text-muted-foreground">
                            {(() => {
                              const pet = pets.find(pet => pet.id === application.petId);
                              if (pet) {
                                return (
                                  <div className="space-y-1">
                                    <div className="flex flex-col gap-2">
                                      <span>Name: {pet.name} <b className="text-xs text-muted-foreground">({application.petId})</b></span>
                                      <span>Type: {pet.type}</span>
                                      <span>Breed: {pet.breed}</span>
                                      <span>Age: {pet.age} year(s) old</span>
                                    </div>
                                  </div>
                                );
                              }
                              return <span>Pet ID: {application.petId}</span>;
                            })()}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium">Contact Details</p>
                          <p className="text-sm text-muted-foreground">
                            Email: {application.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Phone: {application.phone}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Address: {application.address}, {application.city}, {application.state} {application.zip}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Emergency Contact: {application.emergencyContact}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium">Housing Information</p>
                          <p className="text-sm text-muted-foreground">
                            Housing Type: {application.housing}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Own/Rent: {application.ownRent}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Landlord Contact: {application.landlordContact}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium">Pet Experience</p>
                          <p className="text-sm text-muted-foreground">
                            Occupation: {application.occupation}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Other Pets: {application.otherPets}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Veterinarian: {application.veterinarian}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Experience: {application.experience}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium">Application Details</p>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {timeInstance.formatMoment(application.createdAt)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Last Updated: {timeInstance.formatMoment(application.updatedAt)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Commitment: {application.commitment}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            References: {application.references}
                          </p>
                        </div>

                        {application.reason && (
                          <div>
                            <p className="text-sm font-medium">Adoption Reason</p>
                            <p className="text-sm text-muted-foreground">
                              {application.reason}
                            </p>
                          </div>
                        )}

                        {application.notes && (
                          <div>
                            <p className="text-sm font-medium">Notes</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {application.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Add Download PDF button */}
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          disabled={isLoading}
                          variant="outline"
                          size="sm"
                          onClick={() => generatePDF(application)}
                          className="flex items-center gap-2"
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                          Download PDF
                        </Button>
                        <Review application={application} />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {Math.ceil(applications.length / itemsPerPage)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      className={page === 1 ? 'cursor-not-allowed opacity-50' : ''}
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      className={page >= Math.ceil(applications.length / itemsPerPage) ? 'cursor-not-allowed opacity-50' : ''}
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= Math.ceil(applications.length / itemsPerPage)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Applications;

const Review = ({ application }: { application: AdoptionApplicationDetailsForAdmin }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<AdoptionApplicationDetailsForAdmin['status']>(application.status);
  const [notes, setNotes] = useState(application.notes);
  const [open, setOpen] = useState(false);
  const [initialNotesChanged, setInitialNotesChanged] = useState(false);

  useEffect(() => {
    setInitialNotesChanged(notes !== application.notes);
  }, [application.notes, notes]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const updatedAt = new Date().toISOString();
      const response = await api.put(`/pets/adoption-application/${application._id}`, {
        updatedAt,
        status,
        notes
      }, {
        withCredentials: true
      });
      if(response.status === 200) {
        dispatch(updateAdoptionApplicationForAdmin({
          id: application._id,
          updates: { status, notes, updatedAt }
        }));
        setOpen(false);
        toast({
          title: 'Application updated successfully',
          description: 'The application status has been updated.',
        });
      }
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<{error: string}>
      if (!axiosError.response?.data) {
          toast({
              variant: 'destructive', 
              title: "Oops!",
              description: "An error occurred"
          })
          return
      }

      toast({
          variant: 'destructive',
          title: "Oops!", 
          description: axiosError.response.data.error
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            Review Application
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              Review and update the status of this adoption application.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label>Application Status</Label>
              <Select
                disabled={isLoading}
                value={status}
                onValueChange={(value) => {
                  setStatus(value as AdoptionApplicationDetailsForAdmin['status']);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Application Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="needs more info">Needs More Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Notes</Label>
              <Textarea 
                className="w-full rounded-md border max-h-40 p-2"
                disabled={isLoading}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this application..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || !initialNotesChanged} onClick={(e) => {
              e.preventDefault();
              handleSubmit()
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
};