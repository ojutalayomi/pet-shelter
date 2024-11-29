import { useEffect, useState } from 'react'
import { networkMonitor, NetworkStatus } from '@/lib/network'
import { Wifi, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const qualityConfig = {
  excellent: {
    icon: Wifi,
    color: 'text-green-500',
    label: 'Excellent Connection'
  },
  good: {
    icon: Wifi,
    color: 'text-blue-500',
    label: 'Good Connection'
  },
  fair: {
    icon: Wifi,
    color: 'text-yellow-500',
    label: 'Fair Connection'
  },
  poor: {
    icon: Wifi,
    color: 'text-red-500',
    label: 'Poor Connection'
  },
  offline: {
    icon: WifiOff,
    color: 'text-gray-500',
    label: 'Offline'
  }
}

export function NetworkIndicator() {
  const [status, setStatus] = useState<NetworkStatus>(networkMonitor.getNetworkStatus())
  const quality = networkMonitor.getQuality()
  const config = qualityConfig[quality]

  useEffect(() => {
    networkMonitor.subscribe(setStatus)
    return 
  }, [])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <config.icon className={cn("size-5", config.color)} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">{config.label}</p>
            {status.online && (
              <div className="text-xs text-muted-foreground">
                <p>Speed: {status.downlink} Mbps</p>
                <p>Latency: {status.rtt} ms</p>
                <p>Network: {status.effectiveType.toUpperCase()}</p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
