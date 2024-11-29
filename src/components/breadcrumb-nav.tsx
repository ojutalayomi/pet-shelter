import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
  import React from "react"
  import { useLocation, useNavigate } from 'react-router-dom'
  
  export function BreadcrumbNav() {
    const navigate = useNavigate()
    const location = useLocation()
  
    const pathSegments = location.pathname.split('/').filter(Boolean)
    // console.log(pathSegments)
    
    // If no segments (just '/'), return empty breadcrumb
    if (pathSegments.length === 0) return null
  
    const breadcrumbItems = pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      
      const isLast = index === pathSegments.length - 1
      
      return {
        label,
        path: isLast ? undefined : path
      }
    })
    
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className="cursor-pointer">
                {item.path ? (
                  <BreadcrumbLink
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(item.path!)
                    }}
                  >
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }