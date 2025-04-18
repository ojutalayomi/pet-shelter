import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  PawPrint,
  CreditCard,
  // Folder,
  LogOut,
  // MoreHorizontal,
  // Share,
  Sparkles,
  // Trash2,
  Loader2,
  XCircle,
  RotateCw,
  LogIn,
  CircleUserRound,
  ArrowLeftRight,
  WifiOff,
  LayoutDashboard,
  Ban,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import Autoplay from "embla-carousel-autoplay"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"
import { data } from "@/lib/dataSet"
import { useFetchDetails } from "@/providers/fetch-details"
import { BreadcrumbNav } from "./breadcrumb-nav"
import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { ResetIcon } from "@radix-ui/react-icons"
import { NetworkIndicator } from '@/components/network-indicator'
import { useNetwork } from '@/providers/useNetwork'
import { toast } from "@/hooks/use-toast"


const AppSidebar: React.FC<{children: React.ReactNode}> = ({children}) => {
  const accessibleRef = useRef<boolean>(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { open } = useSidebar()
  const { refetchPets, refetchUser, refetchApplications, isLoading, error } = useFetchDetails()
  const { isOnline, quality } = useNetwork()
  const user = useSelector((state: RootState) => state.user)
  
  const fetchDetails = () => {
    if (error.user) refetchUser()
    if (error.pets) refetchPets()
    if (error.applications) refetchApplications()
  }
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  useEffect(() => {
    if(user.status === 'inactive' || user.status === 'suspended') accessibleRef.current = false
    else accessibleRef.current = true
  }, [user.status])

  useEffect(() => {
    if (!isOnline) {
      if (accessibleRef.current) {
        toast({
          variant: 'destructive',
          title: 'No Internet Connection',
          description: 'Please check your connection and try again'
        })
        accessibleRef.current = false
      }
      return
    } else {
      accessibleRef.current = true
    }

    if (quality === 'poor') {
      toast({
        variant: 'destructive',
        title: 'Slow Connection',
        description: 'Search results may take longer to load'
      })
    }
  }, [isOnline, quality])

  useEffect(() => {
    if (!error.user) {
      data.user = {
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        avatar: user.avatar || '/avatars/default.jpg'
      }
    }
  }, [error.user, user])

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <PawPrint className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Petty Store</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {/* Dashboard */}
          {user?.role === 'admin' && (
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem key="dashboard">
                  <SidebarMenuButton asChild>
                    <Link to="/admin/dashboard">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          )}
          {/* Platform */}
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => {
                              if (subItem.title === 'Add New Pet' && user?.role !== 'admin') return;
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <Link to={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          {/* Pages */}
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Pages</SidebarGroupLabel>
            <SidebarMenu>
              {data.pages.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48"
                      side="bottom"
                      align="end"
                    >
                      <DropdownMenuItem>
                        <Folder className="text-muted-foreground" />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="text-muted-foreground" />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                </SidebarMenuItem>
              ))}
              {/* <SidebarMenuItem>
                <SidebarMenuButton>
                  <MoreHorizontal />
                  <span>More</span>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroup>
          {/* Secondary */}
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="sm">
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              {error.user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild
                    onClick={() => navigate('/accounts/login')}
                  >
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <div className="p-2 rounded-lg bg-red-600">
                        <LogIn className="h-5 w-5 text-white" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          Login
                        </span>
                        <span className="truncate text-xs">
                          Login to your account
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Accounts</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/accounts/signup')}>
                      <div className="p-1 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <CircleUserRound className="h-4 w-4" />
                      </div>
                      <div className="grid flex-1 text-left text-sm">
                        <span className="truncate text-xs">
                          Sign Up
                        </span>
                        <span className="truncate text-xs">
                          Create an account
                        </span>
                      </div>
                      <ChevronRight className="ml-auto size-4" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {!error.user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={data.user.avatar}
                          alt={data.user.name}
                        />
                        <AvatarFallback className="rounded-lg">{data.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {data.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {data.user.email}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={data.user.avatar}
                            alt={data.user.name}
                          />
                          <AvatarFallback className="rounded-lg">
                            {data.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {data.user.name}
                          </span>
                          <span className="truncate text-xs">
                            {data.user.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {/* Upgrade to Pro */}
                      <Link to='/accounts/signup'>
                        <DropdownMenuItem>
                          <Sparkles />
                          Upgrade to Pro
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {/* Account */}
                      <Link to='/accounts/profile'>
                        <DropdownMenuItem>
                          <BadgeCheck />
                          Account
                        </DropdownMenuItem>
                      </Link>
                      {/* Billing */}
                      <Link to='/billing'>
                        <DropdownMenuItem>
                          <CreditCard />
                          Billing
                        </DropdownMenuItem>
                      </Link>
                      {/* Notifications */}
                      <Link to='/accounts/notifications'>
                        <DropdownMenuItem>
                          <Bell />
                          Notifications
                        </DropdownMenuItem>
                      </Link>
                      {/* Forgot Password */}
                      <Link to='/accounts/forgot-password'>
                        <DropdownMenuItem>
                          <ResetIcon />
                          Forgot Password
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    {/* Log out */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => {
                          // Prevent the dropdown from closing
                          e.preventDefault()
                        }}>
                          <LogOut />
                          Log out
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You will need to log in again to access your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Link className="bg-red-600 text-white" to="/accounts/logout">
                              Log out
                            </Link>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    {/* Switch User */}
                    <Link to='/accounts/switch-user' state={{ backgroundLocation: location }}>
                      <DropdownMenuItem>
                        <ArrowLeftRight />
                        Switch User
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="h-[95dvh] overflow-y-auto">
        <header className="bg-background flex h-16 shrink-0 items-center gap-2 py-1 top-0 sticky z-10">
          <div className="flex items-center gap-2 px-4">
            {open && (
              <div className="hidden aspect-square size-6 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <PawPrint className="size-3" />
              </div>
            )}
            <SidebarTrigger className="-ml-1" />
            <ModeToggle />
            {(isLoading.user || isLoading.pets) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Loader2 className="size-5 animate-spin" />
                  </TooltipTrigger>
                  <TooltipContent> Loading Data </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {(error.user || error.pets) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative group">
                      <XCircle className="size-5 text-destructive group-hover:hidden" />
                      <RotateCw className="size-5 text-destructive top-0 left-0 hidden group-hover:block cursor-pointer" onClick={fetchDetails} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent> Refresh Data </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <NetworkIndicator />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadcrumbNav/>
          </div>
        </header>
        <div 
          className={`flex flex-1 flex-col gap-4 p-4 pt-0 transition-all duration-300 ${
            isOnline ? 'opacity-100' : 'opacity-50 pointer-events-none select-none'
          }`}
          aria-disabled={!isOnline}
        >
          {(!location.pathname.startsWith('/settings/') &&
            !location.pathname.startsWith('/schedule-visit') &&
            !location.pathname.startsWith('/donate') &&
            !location.pathname.startsWith('/volunteer') &&
            !location.pathname.startsWith('/news') &&
            !location.pathname.startsWith('/emergency-care') &&
            !location.pathname.startsWith('/accounts') &&
            !location.pathname.startsWith('/adoption-process') &&
            !location.pathname.startsWith('/pet-management') &&
            !location.pathname.startsWith('/analytics') &&
            !location.pathname.startsWith('/admin') &&
            !location.pathname.startsWith('/adoption-applications') &&
            location.pathname !== '/') && (
              <Carousel
                plugins={[plugin.current]}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
                // onMouseEnter={plugin.current.stop}
                // onMouseLeave={plugin.current.reset}
              >
                <CarouselContent className="-ml-1">
                  <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3"><div className="aspect-video bg-[url('/paws.jpg')] bg-cover border rounded-xl shadow bg-muted/50" /></CarouselItem>
                  <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3"><div className="aspect-video bg-[url('/kitten.jpg')] bg-cover border rounded-xl shadow bg-muted/50" /></CarouselItem>
                  <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3"><div className="aspect-video bg-[url('/dog-454145_1920.jpg')] bg-cover border rounded-xl shadow bg-muted/50" /></CarouselItem>
                  <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3"><div className="aspect-video bg-[url('/rabbit-8489271_1920.png')] bg-cover border rounded-xl shadow bg-muted/50" /></CarouselItem>
                  <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3"><div className="aspect-video bg-[url('/dog-2606759_1920.jpg')] bg-cover border rounded-xl shadow bg-muted/50" /></CarouselItem>
                </CarouselContent>
              </Carousel>
          )}

          <div className="flex-1 rounded-xl bg-muted/50 md:min-h-min" >
            {!accessibleRef.current ? (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/100">
                <div className="text-center">
                  {!isOnline ? (
                    <>
                    <WifiOff className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-semibold">You're Offline</h3>
                    <p className="text-sm text-muted-foreground">Please check your internet connection</p>
                    </>
                  ) : (
                    <>
                      <Ban className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-semibold">Your account is <span className="text-destructive">{user.status}</span></h3>
                      <p className="text-sm text-muted-foreground">Please contact the administrator to activate your account</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
export default AppSidebar