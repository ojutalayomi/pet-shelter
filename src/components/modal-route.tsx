import { useNavigate, useLocation } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ModalRouteProps {
  children: React.ReactNode
  title?: string
}

export function ModalRoute({ children, title }: ModalRouteProps) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Dialog open={true} onOpenChange={() => navigate(location.state?.backgroundLocation?.pathname || '/')}>
      <DialogContent className="">
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}
