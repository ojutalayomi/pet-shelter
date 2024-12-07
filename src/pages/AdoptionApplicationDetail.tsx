import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BadgeAlert, BadgeCheck, BadgeHelp, Download, InboxIcon, PencilIcon, Loader2 } from 'lucide-react';
import { Time } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AdoptionApplicationDetailsForAdmin } from '@/types/type';

const timeInstance = new Time();

const AdoptionApplicationDetail = () => {
  const navigate = useNavigate();
  const { petId } = useParams();
  const { applications } = useSelector((state: RootState) => state.pet.adoptionApplicationList);
  const pets = useSelector((state: RootState) => state.pet.petData.pets);
  const [application, setApplication] = useState(applications.find(app => app.petId === petId));
  const [isLoading, setIsLoading] = useState(false);

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
          <p class="text-lg text-gray-500">Client's Copy</p>
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

  useEffect(() => {
    setApplication(applications.find(app => app.petId === petId));
  }, [applications, petId]);

  if (!application?.petId) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <InboxIcon className="h-12 w-12 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">Application not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
              {(application.status !== 'approved' && application.status !== 'rejected') && (
                <Button variant='outline' onClick={() => navigate(`/adoption-applications/${petId}/edit`)}>Edit <PencilIcon className="h-4 w-4" /></Button>
              )}
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
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Pet Details</p>
                <div className="text-sm text-muted-foreground">
                  {(() => {
                    const pet = pets.find(pet => pet.id === application.petId);
                    if (pet) {
                      return (
                        <div className="flex flex-col gap-1">
                          <span>Name: {pet.name}</span>
                          <span>Type: {pet.type}</span>
                          <span>Breed: {pet.breed}</span>
                          <span>Age: {pet.age} year(s) old</span>
                        </div>
                      );
                    }
                    return <p>Pet not found</p>;
                  })()}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Contact Information</p>
                <p className="text-sm text-muted-foreground">
                  Phone: {application.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  Emergency Contact: {application.emergencyContact}
                </p>
                <p className="text-sm text-muted-foreground">
                  Address: {application.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  City: {application.city}
                </p>
                <p className="text-sm text-muted-foreground">
                  State: {application.state}
                </p>
                <p className="text-sm text-muted-foreground">
                  ZIP: {application.zip}
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
              {application.status === 'approved' && (
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
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdoptionApplicationDetail;
