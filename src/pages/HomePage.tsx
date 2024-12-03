import { PawPrint, Heart, Calendar, Settings, DollarSign, HandHeart, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { CommandDialogHome } from "@/components/command-dialog-home";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { useRef } from "react"
import { useFetchDetails } from "@/providers/fetch-details"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import Autoplay from "embla-carousel-autoplay"
import { Facebook, Twitter, Instagram, Youtube, ArrowRight, AlertCircle, FileText, ExternalLink, PartyPopper, HeartHandshake } from "lucide-react"
import { NetworkIndicator } from '@/components/network-indicator'
import { useNetwork } from "@/providers/useNetwork"

export default function HomePage() {
  const { isLoading, error } = useFetchDetails()
  const { isOnline } = useNetwork()
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  )
  const plugin2 = useRef(
    Autoplay({ delay: 8000, stopOnInteraction: false })
  )
  return (
    <div className="flex min-h-full flex-1 flex-col px-6 py-8 lg:px-8">
      <div className="absolute top-0 left-0 m-10">
        <NetworkIndicator />
      </div>
      <div className="absolute top-0 right-0 m-10 flex items-center gap-4">
        {error.user ?
          <>
            <Link to="/login" className="text-sm font-medium hover:text-blue-600">
              Login
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/signup" className="text-sm font-medium hover:text-blue-600">
              Sign up
            </Link>
          </> :
          <Link to="/accounts/profile" className="text-sm font-medium hover:text-blue-600">
            My Account
          </Link>
        }
        {isLoading.user && (<div className="h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>)}
        <div className="drop-shadow-lg">
          <ModeToggle />
        </div>
      </div>

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
            <div className="flex flex-col h-48 items-center justify-center hover:border-blue-500 bg-gradient-to-br from-blue-50/30 to-blue-100/30 backdrop-blur-sm hover:bg-gradient-to-br hover:from-blue-100/30 hover:to-blue-200/30 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md p-6 border">
              <div className="p-4 rounded-full bg-blue-100 text-blue-600">
                <PawPrint className="h-8 w-8" />
              </div>
              <span className="dark:text-gray-900 mt-4 text-lg font-semibold">Available Pets</span>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">Find your perfect companion</p>
            </div>
          </Link>

          <Link to="/adoption-center" className="hover:text-inherit">
            <div className="flex flex-col h-48 items-center justify-center hover:border-pink-500 bg-pink-50/30 backdrop-blur-sm hover:bg-pink-100/30 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md p-6 border">
              <div className="p-4 rounded-full bg-pink-100 text-pink-600">
                <Heart className="h-8 w-8" />
              </div>
              <span className="dark:text-gray-900 mt-4 text-lg font-semibold">Adoption Center</span>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">Start your adoption journey</p>
            </div>
          </Link>

          <Link to="/schedule-visit" className="hover:text-inherit">
            <div className="flex flex-col h-48 items-center justify-center hover:border-green-500 bg-green-50/30 backdrop-blur-sm hover:bg-green-100/30 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md p-6 border">
              <div className="p-4 rounded-full bg-green-100 text-green-600">
                <Calendar className="h-8 w-8" />
              </div>
              <span className="dark:text-gray-900 mt-4 text-lg font-semibold">Schedule Visit</span>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">Meet our pets in person</p>
            </div>
          </Link>

          <Link to="/donate" className="hover:text-inherit">
            <div className="flex flex-col h-48 items-center justify-center hover:border-purple-500 bg-purple-50/30 backdrop-blur-sm hover:bg-purple-100/30 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md p-6 border">
              <div className="p-4 rounded-full bg-purple-100 text-purple-600">
                <DollarSign className="h-8 w-8" />
              </div>
              <span className="dark:text-gray-900 mt-4 text-lg font-semibold">Donate</span>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">Support our mission</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Carousel */}
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full mt-12"
        // onMouseEnter={plugin.current.stop}
        // onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="">
          <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3"><div className="aspect-video bg-[url('/paws.jpg')] bg-cover border rounded-xl shadow bg-muted/50" /></CarouselItem>
          <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3"><div className="aspect-video bg-[url('/kitten.jpg')] bg-cover border rounded-xl shadow bg-muted/50" /></CarouselItem>
          <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3"><div className="aspect-video bg-[url('/dog-454145_1920.jpg')] bg-cover border rounded-xl shadow bg-muted/50" /></CarouselItem>
          <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3"><div className="aspect-video bg-[url('/rabbit-8489271_1920.png')] bg-cover border rounded-xl shadow bg-muted/50" /></CarouselItem>
          <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3"><div className="aspect-video bg-[url('/dog-2606759_1920.jpg')] bg-cover border rounded-xl shadow bg-muted/50" /></CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="absolute left-2" />
        <CarouselNext className="absolute right-2" />
      </Carousel>

      {/**/}
      {/* Pet Care Resources */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Pet Care Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border bg-white/50 dark:bg-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">New Pet Owner Guides</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/guides/first-time-owner.pdf" 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <FileText className="h-4 w-4" />
                  First-Time Pet Owner Guide
                </a>
              </li>
              <li>
                <a 
                  href="/guides/pet-training-basics.pdf"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <FileText className="h-4 w-4" />
                  Pet Training Basics
                </a>
              </li>
              <li>
                <a 
                  href="/guides/pet-nutrition.pdf"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <FileText className="h-4 w-4" />
                  Pet Nutrition Guide
                </a>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-xl border bg-white/50 dark:bg-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Trusted Resources</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://www.aspca.org/pet-care"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  ASPCA Pet Care Guidelines
                </a>
              </li>
              <li>
                <a 
                  href="https://www.akc.org/expert-advice/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  AKC Training Resources
                </a>
              </li>
              <li>
                <a 
                  href="https://www.avma.org/resources/pet-owners"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  AVMA Pet Owner Resources
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border bg-white/50 dark:bg-white/10 backdrop-blur-sm">
            <div className="text-orange-500 mb-4">
              <Calendar className="h-8 w-8" />
            </div>
            <h3 className="font-semibold">Weekend Adoption Fair</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Saturday, February 15th, 2025</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">10:00 AM - 4:00 PM</p>
            <Button variant="outline" className="mt-4 w-full">Learn More</Button>
          </div>

          <div className="p-6 rounded-xl border bg-white/50 dark:bg-white/10 backdrop-blur-sm">
            <div className="text-purple-500 mb-4">
              <PartyPopper className="h-8 w-8" />
            </div>
            <h3 className="font-semibold">Pet Training Workshop</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Sunday, July 23rd, 2025</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">2:00 PM - 5:00 PM</p>
            <Button variant="outline" className="mt-4 w-full">Learn More</Button>
          </div>

          <div className="p-6 rounded-xl border bg-white/50 dark:bg-white/10 backdrop-blur-sm">
            <div className="text-blue-500 mb-4">
              <HeartHandshake className="h-8 w-8" />
            </div>
            <h3 className="font-semibold">Fundraising Gala</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Friday, August 5th, 2025</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">6:00 PM - 10:00 PM</p>
            <Button variant="outline" className="mt-4 w-full">Learn More</Button>
          </div>
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/volunteer" className="flex items-center gap-3 p-4 group rounded-lg border hover:bg-gray-50 transition-colors">
          <HandHeart className="h-6 w-6 text-orange-500" />
          <span className="dark:hover:text-gray-900 group-hover:text-gray-500 font-medium">Volunteer With Us</span>
        </Link>

        <Link to="/news" className="flex items-center gap-3 p-4 group rounded-lg border hover:bg-gray-50 transition-colors">
          <Newspaper className="h-6 w-6 text-blue-500" />
          <span className="dark:hover:text-gray-900 group-hover:text-gray-500 font-medium">Shelter News</span>
        </Link>

        <Link to="/settings" className="flex items-center gap-3 p-4 group rounded-lg border hover:bg-gray-50 transition-colors">
          <Settings className="h-6 w-6 text-gray-500" />
          <span className="dark:hover:text-gray-900 group-hover:text-gray-500 font-medium">Settings</span>
        </Link>
      </div>

      {/* Testimonials */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">What Our Volunteers Say</h2>
        <Carousel
          plugins={[plugin2.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="">
            <CarouselItem className="pl-4">
              <div className="p-6 rounded-xl border bg-white/50 dark:bg-white/10 backdrop-blur-sm">
                <p className="text-gray-600 dark:text-gray-400 italic">"Working with these animals has been one of the most rewarding experiences of my life. The dedication of the staff and the love these pets receive is truly inspiring."</p>
                <div className="mt-4 flex items-center gap-3">
                  <img src="/testimonial-3.jpg" alt="Sarah" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500">Volunteer since 2022</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="pl-4">
              <div className="p-6 rounded-xl border bg-white/50 dark:bg-white/10 backdrop-blur-sm">
                <p className="text-gray-600 dark:text-gray-400 italic">"The joy of seeing pets find their forever homes makes every minute spent here worthwhile. This shelter truly makes a difference in both animals' and people's lives."</p>
                <div className="mt-4 flex items-center gap-3">
                  <img src="/testimonial-2.jpg" alt="Michael" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold">Michael Chen</h4>
                    <p className="text-sm text-gray-500">Volunteer since 2021</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="pl-4">
              <div className="p-6 rounded-xl border bg-white/50 dark:bg-white/10 backdrop-blur-sm">
                <p className="text-gray-600 dark:text-gray-400 italic">"Being part of this community has shown me the incredible impact we can have when we come together to help these amazing animals. Every day brings new opportunities to make a difference."</p>
                <div className="mt-4 flex items-center gap-3">
                  <img src="/testimonial-1.jpg" alt="Emily" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold">Emily Rodriguez</h4>
                    <p className="text-sm text-gray-500">Volunteer since 2023</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="absolute left-2" />
          <CarouselNext className="absolute right-2" />
        </Carousel>
      </div>

      {/* Featured Pets */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Featured Pets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pet of the Week */}
          <div className="rounded-xl border p-6 bg-purple-50 dark:bg-purple-900/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img 
                  src="/dog-8448345_1280.jpg" 
                  alt="Luna" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                  Pet of the Week
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Meet Luna</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">3 years old • Female</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Luna has been with us for 6 months. This gentle soul loves cuddles and would make a perfect companion for a quiet home. She's great with children and other pets.
            </p>
            <Link 
              to="/pet/luna"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
            >
              Read Luna's Story
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Urgent Adoptions */}
          <div className="rounded-xl border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Urgent Adoptions
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <img 
                  src="/labrador-8554882_1280.jpg" 
                  alt="Max" 
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-medium">Max</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Senior dog seeking loving home</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Kitten_10.jpg/640px-Kitten_10.jpg" 
                  alt="Bella" 
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-medium">Bella</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Special needs cat, lots of love to give</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <img 
                  src="/cat-8578562_1280.jpg" 
                  alt="Rocky" 
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-medium">Katty</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Long-term resident, 2+ years</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t pt-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Updated</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Subscribe to our newsletter for updates on new pets and shelter news.
            </p>
            <form className="flex flex-col gap-2">
              <input
                disabled={!isOnline}
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg bg-white/50 dark:bg-white/10 border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                disabled={!isOnline}
                type="submit"
                className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Follow us on social media for daily updates and cute pet pictures!
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Petty Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
