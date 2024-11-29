"use client"
// import { cn } from "@/lib/utils"
import { useCallback, useEffect, useState } from "react"
import {
  CreditCard,
  PawPrint,
  Search,
  Settings,
  User,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom"
import axios, { AxiosError } from "axios"
import { PetProfile } from "@/types/type"
// import { Card, CardContent, CardHeader } from "./ui/card"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"

export function PetSearch() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<PetProfile[] | null>(null)

  const submit = useCallback(async () => {
    try {
      if (!search) {
        setResults(null)
        return
      }
        /* FETCH */
        // const response = await fetch('http://localhost:3000/pets/search?query='+search)

        // if (response.status === 200) {
        //     const data = await response.json()
        // }

        /* AXIOS */
        const response = await axios.get(`http://localhost:3000/pets/search?query=${encodeURIComponent(search)}`)

        if (response.status === 200) {
          setResults(response.data)

        }

    } catch (error: unknown) {
        console.error('error', error)
        
        const axiosError = error as AxiosError<{error: string}>
        if (!axiosError.response?.data) {
            toast({
                variant: 'destructive', 
                title: "Oops!",
                description: "An error occurred"
            })
            return
        }

        // toast({
        //     variant: 'destructive',
        //     title: "Oops!", 
        //     description: axiosError.response.data.error
        // })
        setResults(null)
    }
  }, [search])

  useEffect(() => {
    submit()
  }, [search, submit])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-2xl pl-10 pr-4 py-6 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sidebar-primary !bg-background dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
            >
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-400" />
              Search for pets by name, breed, or type...
            </Button>
        </DialogTrigger>
        <DialogContent className="w-[var(--radix-popover-trigger-width)]">
          <DialogHeader>
            <DialogTitle>Search for pets</DialogTitle>
            <DialogDescription>
              Search for pets by name, breed, or type.
            </DialogDescription>
          </DialogHeader>
            <Input
                placeholder="Search for pets by name, breed, or type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {(!results?.length && search) && <p className="text-center text-sm py-6">No pets found.</p>}
            {(results && results?.length > 0) && (
                <div>
                    <h3 className="font-medium mb-2">Pets</h3>
                    {results.map((result: PetProfile) => (
                        <Button
                            key={result.id}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => navigate(`/pet/${result.id}`)}
                        >
                            <PawPrint className="mr-2 h-4 w-4" />
                            <span>{result.name}</span>
                        </Button>
                    ))}
                </div>
            )}
            <Separator className="my-4" />
            <div>
                <h3 className="font-medium mb-2">Settings</h3>
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate(`/profile`)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    <span className="ml-auto text-xs collapse">⌘P</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate(`/billing`)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                    <span className="ml-auto text-xs collapse">⌘B</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate(`/settings`)}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                    <span className="ml-auto text-xs collapse">⌘S</span>
                </Button>
            </div>
        </DialogContent>
    </Dialog>
    </>
  )
}