import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RootState } from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { updateUserProfile } from '@/redux/userSlice';
import { User } from '@/types/type';
import { LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { Alert, AlertDescription } from "@/components/ui/alert";

interface AccountSettingsProps {
  onDeleteAccount?: () => void;
  onLogoutOtherSessions?: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  onDeleteAccount,
  onLogoutOtherSessions,
}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.user)
    const inputImageRef = useRef<HTMLInputElement>(null);
    const currentPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const [loading, isLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [logoutPassword, setLogoutPassword] = useState('');

    const [personalInfo, setPersonalInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        avatar: '',
        username: ''
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
      if (user.id) {
        setPersonalInfo({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          username: user.username
        })
      }
    }, [user])

    useEffect(() => {
      if (!user.id) {
        navigate('/accounts/login')
      }
    }, [navigate, user])

    const submit = async (data: Partial<User & { oldPassword: string }>) => {
        try {
            isLoading(true)

            /* FETCH */
            // const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.id}`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(userData)
            // })

            // if (response.status === 200) {
            //     const data = await response.json()
            //     navigate(`/pet/${data.id}`)
            // }

            /* AXIOS */
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/users/${user.id}`,
                data,
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            )

            if (response.status === 200) {
                dispatch(updateUserProfile(response.data.user))
                toast({
                    title: "You have updated your account succesfully.",
                })
                isLoading(false)
                if (Object.keys(data).includes("password")) {
                  setPasswords({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  })
                }
                // navigate(`/`)

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
            isLoading(false)
        }
    }

    useEffect(() => {
        // Focus on current password field by default
        // currentPasswordRef.current?.focus()

        // Only validate passwords if confirm password has been entered
        if (passwords.confirmPassword) {
            if (passwords.newPassword !== passwords.confirmPassword) {
                confirmPasswordRef.current?.setCustomValidity('Passwords do not match')
                setError('Passwords do not match')
            } else {
                confirmPasswordRef.current?.setCustomValidity('')
                setError(null)
            }
        }
    }, [passwords.newPassword, passwords.confirmPassword])

    const handlePersonalInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit(personalInfo);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword === passwords.confirmPassword) {
            submit({ oldPassword: passwords.currentPassword, password: passwords.newPassword });
        }
    };

    const handleLogoutOtherSessions = (e: React.FormEvent) => {
        e.preventDefault();
        onLogoutOtherSessions?.();
    };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Personal Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <p className="text-sm text-gray-500">
            Use a permanent address where you can receive mail.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
            <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={avatar ? URL.createObjectURL(avatar) : "/placeholder-avatar.jpg"} alt="Avatar" />
                    <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <input
                    ref={inputImageRef}
                    type="file"
                    disabled={loading}
                    id="avatar-upload"
                    accept="image/jpeg,image/png,image/gif"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.size <= 1024 * 1024) {
                          // Handle file upload
                          console.log(file);
                          setPersonalInfo({ ...personalInfo, avatar: file.name });
                          setAvatar(file);
                        }
                    }}
                    />
                    <Button 
                    disabled={loading}
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      inputImageRef.current?.click()
                    }}
                    >
                    Change avatar
                    </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                    JPG, GIF or PNG. 1MB max.
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First name</label>
                <Input
                  value={personalInfo.firstName}
                  disabled={loading}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last name</label>
                <Input
                  value={personalInfo.lastName}
                  disabled={loading}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email address</label>
              <Input
                type="email"
                value={personalInfo.email}
                disabled={loading}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                value={personalInfo.username}
                disabled={loading}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, username: e.target.value })
                }
                placeholder="example.com/username"
              />
            </div>

            <Button disabled={loading} type="submit">{loading && <LoaderCircle className="animate-spin text-white" />}Save</Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <p className="text-sm text-gray-500">
            Update your password associated with your account.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current password</label>
              <Input
                ref={currentPasswordRef}
                type="password"
                value={passwords.currentPassword}
                disabled={loading}
                onChange={(e) =>
                  setPasswords({ ...passwords, currentPassword: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">New password</label>
              <Input
                ref={newPasswordRef}
                type="password"
                value={passwords.newPassword}
                disabled={loading}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm password</label>
              <Input
                className={error ? 'border-red-500' : ''}
                ref={confirmPasswordRef}
                type="password"
                value={passwords.confirmPassword}
                disabled={loading}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirmPassword: e.target.value })
                }
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <Button disabled={loading} type="submit">{loading && <LoaderCircle className="animate-spin text-white" />}Save</Button>
          </form>
        </CardContent>
      </Card>

      {/* Log out other sessions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Log out other sessions</CardTitle>
          <p className="text-sm text-gray-500">
            Please enter your password to confirm you would like to log out of your
            other sessions across all of your devices.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogoutOtherSessions} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your password</label>
              <Input
                type="password"
                value={logoutPassword}
                disabled={loading}
                onChange={(e) => setLogoutPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              disabled={loading}
            >
              {loading && <LoaderCircle className="animate-spin text-white" />}Log out other sessions
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Delete Account Section */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Delete account</CardTitle>
          <p className="text-sm text-gray-500">
            No longer want to use our service? You can delete your account here.
            This action is not reversible. All information related to this account
            will be deleted permanently.
          </p>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={onDeleteAccount}
            // disabled={loading}
          >
            {/* {loading && <LoaderCircle className="animate-spin text-white" />} */}Yes, delete my account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;