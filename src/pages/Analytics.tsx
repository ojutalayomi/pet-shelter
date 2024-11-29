import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { updateDisplay } from "@/redux/settingsSlice"
import { Activity, PawPrint, Heart, DollarSign, Calendar, Users } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Time } from "@/lib/utils"

const timeInstance = new Time();

const monthlyData = [
  { name: 'Jan', adoptions: 120, donations: 10000 },
  { name: 'Feb', adoptions: 156, donations: 12234 },
  { name: 'Mar', adoptions: 130, donations: 11500 },
  { name: 'Apr', adoptions: 145, donations: 13000 },
  { name: 'May', adoptions: 160, donations: 14500 },
  { name: 'Jun', adoptions: 175, donations: 15200 },
  { name: 'Jul', adoptions: 168, donations: 14800 },
  { name: 'Aug', adoptions: 182, donations: 16000 },
  { name: 'Sep', adoptions: 155, donations: 13800 },
  { name: 'Oct', adoptions: 148, donations: 13200 },
  { name: 'Nov', adoptions: 162, donations: 14100 },
  { name: 'Dec', adoptions: 180, donations: 15800 }
]

const Analytics = () => {
  const dispatch = useDispatch<AppDispatch>()
  const pets = useSelector((state: RootState) => state.pet.petData.pets)
  const adoptedPets = pets?.filter(pet => pet.status === 'adopted').sort((a, b) => new Date(b.medicalHistory.lastCheckup).getTime() - new Date(a.medicalHistory.lastCheckup).getTime())
  const [displayData, setDisplayData] = useState<{
    statistics: typeof monthlyData,
    monthlyData: typeof monthlyData
  }>({ statistics: monthlyData, monthlyData: monthlyData })
  
  const totalPets = pets?.length

  useEffect(() => {
    dispatch(updateDisplay({ displayPetBanner: false }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const petCategories = [
    { name: 'Dogs', value: 45 },
    { name: 'Cats', value: 35 },
    { name: 'Birds', value: 12 },
    { name: 'Others', value: 8 },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <div className="container mx-auto px-6 py-3">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPets}</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adoptions</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adoptedPets?.length}</div>
            <p className="text-xs text-muted-foreground">+23% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Visits</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Active this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pet Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={petCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {petCategories.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Monthly Trends</CardTitle>
            <select 
              className="p-2 rounded border bg-background"
              defaultValue="6"
              onChange={(e) => {
                const months = parseInt(e.target.value)
                // Filter last N months of data
                const filteredData = monthlyData.slice(-months)
                setDisplayData({ ...displayData, monthlyData: filteredData })
              }}
            >
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
              <option value="12">Last 12 months</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayData.monthlyData || monthlyData.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="adoptions" stroke="#8884d8" />
                  <Line yAxisId="right" type="monotone" dataKey="donations" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Adoptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 h-[300px] overflow-y-auto">
              {adoptedPets?.slice(0, 5).map((adoption, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{adoption.name}</p>
                    <p className="text-sm text-muted-foreground">{adoption.type}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{timeInstance.formatMoment(adoption.medicalHistory.lastCheckup)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Monthly Statistics</CardTitle>
            <select 
              className="p-2 rounded border bg-background"
              defaultValue="6"
              onChange={(e) => {
                const months = parseInt(e.target.value)
                // Filter last N months of data
                const filteredData = monthlyData.slice(-months)
                setDisplayData({ ...displayData, statistics: filteredData })
              }}
            >
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
              <option value="12">Last 12 months</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayData.statistics || monthlyData.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="adoptions" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Analytics
