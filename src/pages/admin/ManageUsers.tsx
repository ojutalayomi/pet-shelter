import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Loader2, Users } from 'lucide-react'
import { InviteAdminButton } from './Dashboard'
import { api } from '@/providers/fetch-details'
import { toast } from '@/hooks/use-toast'
import { User } from '@/types/type'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'


const ManageUsers = () => {
  const user = useSelector((state: RootState) => state.user)
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  
  const filterUsers = (status: string) => {
    if (status === 'all') {
      return users
    }
    return users.filter(user => user.status === status)
  }

  const updateUser = (user: User) => {
    const updatedUsers = users.filter(u => u.id === user.id)
    setUsers([...updatedUsers, user])
  }

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/users', {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      })
      setUsers(response.data.filter((u: User) => u.id !== user.id))
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch users'
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 w-1/2">
          <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Users className="size-6" />
          </div>
          <div className='truncate'>
            <h1 className="text-2xl font-bold truncate">Manage Users</h1>
            <p className="text-muted-foreground truncate">View and manage all users in the system</p>
          </div>
        </div>
        <div className="flex gap-2 items-end justify-end flex-wrap">
          <Button
            onClick={fetchUsers}
            disabled={isLoading}
          >
            Refresh Data
          </Button>
          <InviteAdminButton />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="col-span-3 w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="viewOnly">View Only</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filterUsers(selectedStatus).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No users found</p>
              </div>
            ) : (
              <>
                {filterUsers(selectedStatus).map((user) => (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between gap-4 rounded-lg border p-4"
                  >
                    <div className="flex flex-1 items-center justify-start gap-4 truncate">
                      <Avatar>
                        <AvatarFallback>
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="truncate">
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center sm:flex-row flex-col gap-2">
                      <EditUserDialog user={user} updateUser={updateUser} />
                      <Button
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ManageUsers

const EditUserDialog = ({ user, updateUser }: { user: User, updateUser: (user: User) => void }) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const submit = async (data: Partial<User & { oldPassword: string }>) => {
    try {
        setIsLoading(true)

        const response = await api.put(
            `/users/${user.id}?id=${user._id}`,
            data,
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        )
        if (response.status === 200) {
            updateUser({ ...user, ...response.data.user })
            toast({
                title: "You have updated the user's account successfully.",
            })
            setIsLoading(false)
            setOpen(false)
        }

    } catch (error: unknown) {
        console.error('error', error)
        
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
  }

  const form = useForm<Partial<User>>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status
    }
  })

  const onSubmit = form.handleSubmit(submit)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">First Name</Label>
            <Input
              id="firstName"
              {...form.register('firstName')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">Last Name</Label>
            <Input
              id="lastName"
              {...form.register('lastName')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input
              id="email"
              {...form.register('email')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Role</Label>
            <Select onValueChange={(value: "user" | "admin" | "volunteer") => form.setValue('role', value)} defaultValue={user.role}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select onValueChange={(value: "active" | "inactive" | "suspended" | "viewOnly") => form.setValue('status', value)} defaultValue={user.status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="viewOnly">View Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button disabled={isLoading} type="submit">
              Save changes{isLoading && <Loader2 className="size-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}