import { useRef, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { PawPrint, Users, Package, DollarSign, TrendingUp, UserPlus, Send, Loader2, InboxIcon, BadgeAlert, BadgeCheck, BadgeHelp, Calendar } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/type';
import { Time } from '@/lib/utils';
import { api, useFetchDetails } from '@/providers/fetch-details';

const timeInstance = new Time();

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoading, refetchApplications } = useFetchDetails()
  const user = useSelector((state: RootState) => state.user);
  const { applications, pagination } = useSelector((state: RootState) => state.pet.adoptionApplicationListForAdmin)
  const [page, setPage] = useState(pagination.currentPage);
  const itemsPerPage = pagination.itemsPerPage;
  

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      change: "+12%",
      timespan: "from last month"
    },
    {
      title: "Total Adoptions", 
      value: "845",
      icon: Package,
      change: "+8%",
      timespan: "from last month"
    },
    {
      title: "Total Pets",
      value: "123",
      icon: Package,
      change: "+8%",
      timespan: "from last month"
    },
    {
      title: "Total Donations",
      value: "$1,234",
      icon: DollarSign,
      change: "+12%",
      timespan: "from last month"
    },
    {
      title: "Revenue",
      value: "$23,456",
      icon: DollarSign,
      change: "+15%", 
      timespan: "from last month"
    },
    {
      title: "Growth",
      value: "24%",
      icon: TrendingUp,
      change: "+4%",
      timespan: "from last month"
    }
  ];

  const fosteredStats = {
    title: "Total Fostered Pets",
    value: "123",
    icon: Package,
    change: "+10%",
    timespan: "from last month"
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.firstName}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your store today.</p>
          </div>
        </div>
        <Button
          onClick={() => refetchApplications()}
          disabled={isLoading.applications}
        >
          Refresh Data
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          if(stat.title === 'Total Adoptions') {
            return (
              <Card key={index} className="p-4">
                <Tabs defaultValue={stat.title === 'Total Adoptions' ? 'adoptions' : 'fostered'}>
                  <TabsList className="justify-around">
                    <TabsTrigger className="px-2 text-xs" value="adoptions">
                      <stat.icon className="size-4 text-muted-foreground mr-1" />
                      Adoptions
                    </TabsTrigger>
                    <TabsTrigger className="px-2 text-xs" value="fostered">
                      <stat.icon className="size-4 text-muted-foreground mr-1" />
                      Fostered
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="adoptions">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500">{stat.change}</span> {stat.timespan}
                    </p>
                  </TabsContent>
                  <TabsContent value="fostered">
                    <div className="text-2xl font-bold">{fosteredStats.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500">{fosteredStats.change}</span> {fosteredStats.timespan}
                    </p>
                  </TabsContent>
                </Tabs>
              </Card>
            )
          }
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">{stat.change}</span> {stat.timespan}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader className="flex items-center justify-between pb-3">
            <CardTitle>Recent Applications</CardTitle>
            <Button variant="link" size="sm" onClick={() => navigate('/admin/applications'/* , { state: { backgroundLocation: location } } */)}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <InboxIcon className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">No recent applications to display</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {applications
                      .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                      .map((application) => (
                        <div 
                          key={application._id} 
                          className="flex items-center gap-2 rounded-lg border px-2 py-4 transition-colors hover:bg-muted/50"
                        >
                          <Avatar className="border p-2 rounded-full">
                            <AvatarFallback>
                              {application.firstName[0]}{application.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium truncate">
                                {application.firstName} {application.lastName}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {timeInstance.formatMoment(application.createdAt)}
                            </p>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {
                                  application.status === 'rejected' ? <BadgeAlert/> :
                                  application.status === 'approved' ? <BadgeCheck/> :
                                  <BadgeHelp/>
                                }
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{application.status}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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

        <Card>
          <CardHeader>
            <CardTitle>Popular Pets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for popular pets list */}
              <p className="text-sm text-muted-foreground">No popular pets to display</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate('/admin/pets/add')} variant="outline" className="w-full justify-start">
                <PawPrint className="mr-2 size-4" />
                Add New Pet
              </Button>
              <Button onClick={() => navigate('/admin/users')} variant="outline" className="w-full justify-start">
                <Users className="mr-2 size-4" />
                Manage Users
              </Button>
              <Button onClick={() => navigate('/admin/reports')} variant="outline" className="w-full justify-start">
                <DollarSign className="mr-2 size-4" />
                View Reports
              </Button >
              <InviteAdminButton />
              <Button onClick={() => navigate('/admin/visits')} variant="outline" className="w-full justify-start">
                <Calendar className="size-4 mr-2" />
                Scheduled Visits
              </Button>
              <Button onClick={() => navigate('/admin/emergency-care')} variant="outline" className="w-full justify-start truncate">
                <BadgeHelp className="size-4 mr-2" />
                Emergency Care Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

export function InviteAdminButton() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const CloseButtonRef = useRef<HTMLButtonElement>(null);
  const [data, setData] = useState({
    name: '',
    email: '',
    role: 'admin' as User['role']
  });

  const handleInvite = async () => {
    setIsLoading(true);
    
    try {
      const response = await api.post('/users/invite', 
        data,
        { headers: {
          'Content-Type': 'application/json',
          }, 
          withCredentials: true 
      });
      // console.log(response.data);
      if (response.status === 200) {
        toast({
          title: "Success!",
          description: "Admin invited successfully"
        })
        navigate('/admin/dashboard');
        setData({
          name: '',
          email: '',
          role: 'admin'
        });
        CloseButtonRef.current?.click();
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
            
        const axiosError = error as AxiosError<{error: string, message: string}>
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
            description: axiosError.response.data.error || axiosError.response.data.message
        })
        setIsLoading(false)
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start">
          <UserPlus className="mr-2 size-4" />
          Invite Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Admin</DialogTitle>
          <DialogDescription>
            Invite an admin to the platform.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="name" className="sr-only">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value="admin"
                  checked={data.role === 'admin'}
                  onChange={(e) => setData({ ...data, role: e.target.value as User['role'] })}
                />
                <Label htmlFor="admin">Admin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="volunteer"
                  name="role"
                  value="volunteer"
                  checked={data.role === 'volunteer'}
                  onChange={(e) => setData({ ...data, role: e.target.value as User['role'] })}
                />
                <Label htmlFor="volunteer">Volunteer</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary" ref={CloseButtonRef}>
              Close
            </Button>
          </DialogClose>
          <Button disabled={isLoading || !data.email || !data.name} onClick={handleInvite} type="submit" size="sm" className="px-3">
            { isLoading ?
              <>
                <span className="sr-only">Loading...</span>
                <Loader2 className="size-4 animate-spin" />
              </>
            :
              <>
                <span className="sr-only">Invite</span>
                Invite
                <Send />
              </>
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}