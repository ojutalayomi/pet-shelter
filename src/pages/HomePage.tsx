import { PawPrint, Heart, Calendar, Settings, DollarSign, HandHeart, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { CommandDialogHome } from "@/components/command-dialog-home";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col px-6 py-8 lg:px-8">
      {/* Hero Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl text-center">
        <div className="flex items-center justify-center gap-2 sm:mx-auto sm:w-full">
          <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <PawPrint className="size-6" />
          </div>
          <span className="text-2xl font-bold">Petty Store</span>
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight dark:text-gray-100 text-gray-900">
          Where Every Pet Finds Their Forever Home
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Join us in giving animals a second chance at happiness. Adopt, foster, or support our mission today.
        </p>
      </div>

      {/* Search Bar */}
      <CommandDialogHome />

      {/* Main Actions Grid */}
      <div className="mt-12">
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/pet-management/available-pets" className="hover:text-inherit">
            <div className="flex flex-col h-48 items-center justify-center hover:border-blue-500 bg-blue-50 hover:bg-blue-100 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md p-6 border">
              <div className="p-4 rounded-full bg-blue-100 text-blue-600">
                <PawPrint className="h-8 w-8" />
              </div>
              <span className="dark:text-gray-900 mt-4 text-lg font-semibold">Available Pets</span>
              <p className="mt-2 text-sm text-gray-600 text-center">Find your perfect companion</p>
            </div>
          </Link>

          <Link to="/adoption-center" className="hover:text-inherit">
            <div className="flex flex-col h-48 items-center justify-center hover:border-pink-500 bg-pink-50 hover:bg-pink-100 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md p-6 border">
              <div className="p-4 rounded-full bg-pink-100 text-pink-600">
                <Heart className="h-8 w-8" />
              </div>
              <span className="dark:text-gray-900 mt-4 text-lg font-semibold">Adoption Center</span>
              <p className="mt-2 text-sm text-gray-600 text-center">Start your adoption journey</p>
            </div>
          </Link>

          <Link to="/schedule-visit" className="hover:text-inherit">
            <div className="flex flex-col h-48 items-center justify-center hover:border-green-500 bg-green-50 hover:bg-green-100 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md p-6 border">
              <div className="p-4 rounded-full bg-green-100 text-green-600">
                <Calendar className="h-8 w-8" />
              </div>
              <span className="dark:text-gray-900 mt-4 text-lg font-semibold">Schedule Visit</span>
              <p className="mt-2 text-sm text-gray-600 text-center">Meet our pets in person</p>
            </div>
          </Link>

          <Link to="/donate" className="hover:text-inherit">
            <div className="flex flex-col h-48 items-center justify-center hover:border-purple-500 bg-purple-50 hover:bg-purple-100 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md p-6 border">
              <div className="p-4 rounded-full bg-purple-100 text-purple-600">
                <DollarSign className="h-8 w-8" />
              </div>
              <span className="dark:text-gray-900 mt-4 text-lg font-semibold">Donate</span>
              <p className="mt-2 text-sm text-gray-600 text-center">Support our mission</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/volunteer" className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
          <HandHeart className="h-6 w-6 text-orange-500" />
          <span className="font-medium">Volunteer With Us</span>
        </Link>

        <Link to="/news" className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
          <Newspaper className="h-6 w-6 text-blue-500" />
          <span className="font-medium">Shelter News</span>
        </Link>

        <Link to="/settings" className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
          <Settings className="h-6 w-6 text-gray-500" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </div>
  );
}
