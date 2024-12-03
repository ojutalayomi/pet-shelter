import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BadgeAlert, BadgeCheck, BadgeHelp, InboxIcon, Download } from 'lucide-react';
import { Time } from '@/lib/utils';
import { AdoptionApplicationDetailsForAdmin } from '@/types/type';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { updateAdoptionApplicationForAdmin } from '@/redux/petSlice';
import { Textarea } from '@/components/ui/textarea';
import jsPDF from 'jspdf';

const timeInstance = new Time();

const Applications = () => {
  const { applications, pagination } = useSelector((state: RootState) => state.pet.adoptionApplicationListForAdmin);
  const pets = useSelector((state: RootState) => state.pet.petData.pets);
  const [page, setPage] = useState(1);
  const itemsPerPage = pagination.itemsPerPage;

  const generatePDF = async (application: AdoptionApplicationDetailsForAdmin) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pet = pets.find(pet => pet.id === application.petId);

    // PDF Content
    pdf.setFontSize(20);
    pdf.text('Adoption Application Details', 20, 20);
    
    pdf.setFontSize(12);
    // Applicant Details
    pdf.text('Applicant Information', 20, 35);
    pdf.setFontSize(10);
    pdf.text(`Name: ${application.firstName} ${application.lastName}`, 20, 45);
    pdf.text(`Email: ${application.email}`, 20, 52);
    pdf.text(`Phone: ${application.phone}`, 20, 59);
    pdf.text(`Address: ${application.address}, ${application.city}, ${application.state} ${application.zip}`, 20, 66);
    
    // Pet Details
    pdf.setFontSize(12);
    pdf.text('Pet Information', 20, 80);
    pdf.setFontSize(10);
    if (pet) {
      pdf.text(`Name: ${pet.name}`, 20, 90);
      pdf.text(`Type: ${pet.type}`, 20, 97);
      pdf.text(`Breed: ${pet.breed}`, 20, 104);
      pdf.text(`Age: ${pet.age} year(s)`, 20, 111);
    } else {
      pdf.text(`Pet ID: ${application.petId}`, 20, 90);
    }

    // Housing Information
    pdf.setFontSize(12);
    pdf.text('Housing Information', 20, 125);
    pdf.setFontSize(10);
    pdf.text(`Housing Type: ${application.housing}`, 20, 135);
    pdf.text(`Own/Rent: ${application.ownRent}`, 20, 142);
    if (application.landlordContact) {
      pdf.text(`Landlord Contact: ${application.landlordContact}`, 20, 149);
    }

    // Application Status
    pdf.setFontSize(12);
    pdf.text('Application Status', 20, 165);
    pdf.setFontSize(10);
    pdf.text(`Status: ${application.status}`, 20, 175);
    pdf.text(`Submitted: ${timeInstance.formatMoment(application.createdAt)}`, 20, 182);
    pdf.text(`Last Updated: ${timeInstance.formatMoment(application.updatedAt)}`, 20, 189);

    // Notes
    if (application.notes) {
      pdf.setFontSize(12);
      pdf.text('Notes', 20, 205);
      pdf.setFontSize(10);
      const splitNotes = pdf.splitTextToSize(application.notes, 170);
      pdf.text(splitNotes, 20, 215);
    }

    // Footer
    pdf.setFontSize(8);
    pdf.text(`Generated on ${new Date().toLocaleString()}`, 20, 287);

    // Save the PDF
    pdf.save(`adoption-application-${application.firstName}-${application.lastName}.pdf`);
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
                      className="flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex flex-wrap items-center gap-4">
                        <Avatar className="border p-2 rounded-full">
                          <AvatarFallback>
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
                                  <BadgeHelp className="h-6 w-6 text-yellow-500"/>
                                }
                                <span className="text-xs font-medium capitalize">
                                  {application.status}
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
                          {application.landlordContact && (
                            <p className="text-sm text-muted-foreground">
                              Landlord Contact: {application.landlordContact}
                            </p>
                          )}
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
                          variant="outline"
                          size="sm"
                          onClick={() => generatePDF(application)}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
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
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/pets/adoption-application/${application._id}`, {
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