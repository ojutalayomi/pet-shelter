import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users } from 'lucide-react'
import { InviteAdminButton } from './Dashboard'
import { api } from '@/providers/fetch-details'
import { toast } from '@/hooks/use-toast'
import { User } from '@/types/type'

const ManageUsers = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/users', {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      })
      setUsers(response.data)
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
  }

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
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between gap-4 rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ManageUsers
