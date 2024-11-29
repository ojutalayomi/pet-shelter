import {
    HeartPulse,
    MessageCircle,
    DollarSign,
    Activity,
    Store,
    PawPrint,
    Send,
    Settings2,
    PlusCircle,
    Calendar,
    Siren,
    Syringe,
    Library,
    Pill,
    House,
    UserRound,
    BellDot,
    ListCheck,
} from "lucide-react"

export type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType;
  description?: string;
  bgColor?: string;
  iconColor?: string;
  hoverColor?: string;
}

export type NavSection = NavItem & {
  isActive?: boolean;
  items: NavItem[];
}

export type PageItem = {
  name: string;
  url: string;
  icon: React.ComponentType;
  description: string;
  bgColor: string;
  iconColor: string;
  hoverColor: string;
}

export type DataSet = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: NavSection[];
  navSecondary: NavItem[];
  pages: PageItem[];
}

export const data: DataSet = {
    user: {
      name: "staffmember",
      email: "staff@petparadise.com",
      avatar: "/avatars/staff.jpg",
    },
    navMain: [
      {
        title: "Quick Actions",
        url: "/quick-actions",
        icon: PlusCircle,
        isActive: true,
        items: [
          {
            title: "Add New Pet",
            url: "/admin/pets/add",
            icon: PawPrint,
            description: "Add a new pet to the system",
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-500',
            hoverColor: 'hover:bg-blue-500/20'
          },
          {
            title: "Schedule Visit",
            url: "/schedule-visit",
            icon: Calendar,
            description: "Schedule a visit for a pet",
            bgColor: 'bg-purple-500/10',
            iconColor: 'text-purple-500',
            hoverColor: 'hover:bg-purple-500/20'
          },
          {
            title: "Emergency Care",
            url: "/emergency-care",
            icon: Siren,
            description: "Schedule a visit for a pet",
            bgColor: 'bg-red-500/10',
            iconColor: 'text-red-500',
            hoverColor: 'hover:bg-red-500/20'
          },
        ],
      },
      {
        title: "Pet Management",
        url: "/pet-management",
        icon: PawPrint,
        items: [
          {
            title: "Available Pets",
            url: "/pet-management/available-pets",
            icon: PawPrint,
            description: "View and manage available pets for adoption",
            bgColor: 'bg-green-500/10',
            iconColor: 'text-green-500',
            hoverColor: 'hover:bg-green-500/20'
          },
          {
            title: "Adopted Pets",
            url: "/pet-management/adopted-pets",
            icon: PawPrint,
            description: "View and manage adopted pets",
            bgColor: 'bg-yellow-500/10',
            iconColor: 'text-yellow-500',
            hoverColor: 'hover:bg-yellow-500/20'
          },
          {
            title: "Foster Care",
            url: "/pet-management/foster-care",
            icon: PawPrint,
            description: "View and manage foster care pets",
            bgColor: 'bg-orange-500/10',
            iconColor: 'text-orange-500',
            hoverColor: 'hover:bg-orange-500/20'
          },
        ],
      },
      {
        title: "Healthcare",
        url: "/healthcare",
        icon: HeartPulse,
        items: [
          {
            title: "Vaccinations",
            url: "/healthcare/vaccinations",
            icon: Syringe,
            description: "Manage the vaccination records for the shelter",
            bgColor: 'bg-green-500/10',
            iconColor: 'text-green-500',
            hoverColor: 'hover:bg-green-500/20'
          },
          {
            title: "Medical Records",
            url: "/healthcare/medical-records", 
            icon: Library,
            description: "View and manage medical histories and health records",
            bgColor: 'bg-yellow-500/10',
            iconColor: 'text-yellow-500',
            hoverColor: 'hover:bg-yellow-500/20'
          },
          {
            title: "Treatments",
            url: "/healthcare/treatments",
            icon: PawPrint,
            description: "View and manage treatments for the shelter",
            bgColor: 'bg-orange-500/10',
            iconColor: 'text-orange-500',
            hoverColor: 'hover:bg-orange-500/20'
          },
          {
            title: "Medications",
            url: "/healthcare/medications",
            icon: Pill,
            description: "View and manage medications for the shelter",
            bgColor: 'bg-orange-500/10',
            iconColor: 'text-orange-500',
            hoverColor: 'hover:bg-orange-500/20'
          },
        ],
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
        items: [
          {
            title: "Accounts",
            url: "/settings/account",
            icon: UserRound,
            description: "View and manage your account information",
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-500', 
            hoverColor: 'hover:bg-blue-500/20'
          },
          {
            title: "Shelter Info",
            url: "/settings/shelter-info",
            icon: House,
            description: "View and manage shelter information",
            bgColor: 'bg-purple-500/10',
            iconColor: 'text-purple-500',
            hoverColor: 'hover:bg-purple-500/20'
          },
          {
            title: "Notifications",
            url: "/settings/notifications",
            icon: BellDot,
            description: "View and manage notifications for the shelter",
            bgColor: 'bg-pink-500/10',
            iconColor: 'text-pink-500',
            hoverColor: 'hover:bg-pink-500/20'
          },
          {
            title: "Permissions",
            url: "/settings/permissions",
            icon: ListCheck,
            description: "View and manage permissions for the shelter",
            bgColor: 'bg-indigo-500/10',
            iconColor: 'text-indigo-500',
            hoverColor: 'hover:bg-indigo-500/20'
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Help Center",
        url: "/help-center",
        icon: MessageCircle,
        description: "View the help center for the shelter",
        bgColor: 'bg-green-500/10',
        iconColor: 'text-green-500',
        hoverColor: 'hover:bg-green-500/20'
      },
      {
        title: "Contact Vet",
        url: "/contact-vet",
        icon: Send,
        description: "Contact the vet for the shelter",
        bgColor: 'bg-yellow-500/10',
        iconColor: 'text-yellow-500',
        hoverColor: 'hover:bg-yellow-500/20'
      },
    ],
    pages: [
      {
        name: "Adoption Center",
        url: "/adoption-center",
        icon: Store,
        bgColor: 'bg-green-500/10',
        iconColor: 'text-green-500',
        hoverColor: 'hover:bg-green-500/20',
        description: "Manage the adoption center",
      },
      {
        name: "Analytics",
        url: "/analytics",
        icon: Activity,
        bgColor: 'bg-yellow-500/10',
        iconColor: 'text-yellow-500',
        hoverColor: 'hover:bg-yellow-500/20',
        description: "View analytics for the shelter",
      },
      {
        name: "Financial",
        url: "/financial",
        icon: DollarSign,
        bgColor: 'bg-orange-500/10',
        iconColor: 'text-orange-500',
        hoverColor: 'hover:bg-orange-500/20',
        description: "Manage the financial records for the shelter",
      },
    ],
}  