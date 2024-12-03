import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { SidebarProvider } from './components/ui/sidebar'
import AppSidebar from "@/components/app-sidebar"
import Main from '@/components/main'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/providers/theme-provider'
import FetchDetailsProvider from '@/providers/fetch-details'
import { NetworkProvider } from '@/providers/network-provider'
import HomePage from '@/pages/HomePage'

function App() {

  return (
    <Router>
      <NetworkProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <FetchDetailsProvider>
            <div className="App h-screen w-screen">
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/*' element={
                  <SidebarProvider>
                    <AppSidebar>
                      <div className="flex items-center gap-2 px-4">
                      </div>
                      <main className='flex-1 flex flex-col h-full'>
                        <Main/>
                      </main>
                    </AppSidebar>
                  </SidebarProvider>
                } />
              </Routes>
            </div>
            <Toaster />
          </FetchDetailsProvider>
        </ThemeProvider>
      </NetworkProvider>
    </Router>
  )
}

export default App