/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react'
import { networkMonitor, NetworkStatus, NetworkQuality } from '@/lib/network'
import { useToast } from '@/hooks/use-toast'

type NetworkContextType = {
  status: NetworkStatus
  quality: NetworkQuality
  isOnline: boolean
}

export const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<NetworkStatus>(networkMonitor.getNetworkStatus())
  const { toast } = useToast()

  useEffect(() => {
    function updateOnlineStatus() {
      const newStatus = {
        ...status,
        online: navigator.onLine,
        effectiveType: (navigator as any).connection?.effectiveType || 'unknown',
        downlink: (navigator as any).connection?.downlink || 0,
        rtt: (navigator as any).connection?.rtt || 0,
        saveData: (navigator as any).connection?.saveData || false
      }
      setStatus(newStatus)

      if (newStatus.online !== status.online) {
        toast({
          title: newStatus.online ? 'Back Online' : 'Offline',
          description: newStatus.online 
            ? 'Your internet connection has been restored'
            : 'You are currently offline',
          variant: newStatus.online ? 'default' : 'destructive',
        })
      }
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      connection?.addEventListener('change', updateOnlineStatus)
      return () => {
        connection?.removeEventListener('change', updateOnlineStatus)
      }
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [status, toast])

  const getQuality = (): NetworkQuality => {
    if (!status.online) return 'offline'
    
    if (status.effectiveType === '4g' && status.rtt < 100) {
      return 'excellent'
    } else if (status.effectiveType === '4g' || (status.effectiveType === '3g' && status.rtt < 200)) {
      return 'good'
    } else if (status.effectiveType === '3g' || (status.effectiveType === '2g' && status.rtt < 400)) {
      return 'fair'
    } else {
      return 'poor'
    }
  }

  return (
    <NetworkContext.Provider value={{ status, quality: getQuality(), isOnline: status.online }}>
      {children}
    </NetworkContext.Provider>
  )
}
