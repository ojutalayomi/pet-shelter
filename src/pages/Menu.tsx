import { PawPrint } from "lucide-react";
import { data, NavSection } from "@/lib/dataSet"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Menu({ filter = 'quick-actions', segment = 'navMain' }: { filter?: string, segment?: keyof typeof data }) {
  const user = useSelector((state: RootState) => state.user);
  const [filteredData, setFilteredData] = useState<NavSection | null>(null);

  useEffect(() => {
    if (Array.isArray(data[segment])) {
      setFilteredData(data[segment].find((d: { url: string }) => d.url === `/${filter}`) as NavSection);
    }
  }, [filter, segment]);

    return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center p-6 lg:p-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex items-center justify-center gap-2 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <PawPrint className="size-4" />
                </div>
                <span className="truncate font-semibold">Petty Store Shortcuts</span>
            </div>
            {/* <div className="mt-1 text-center text-lg font-bold tracking-tight dark:text-gray-100 text-gray-900">
                Where Every Pet Finds Their Forever Home
            </div> */}
            <div className="flex items-center justify-center gap-2 mt-6 text-center">
              {/* @ts-expect-error - icon component does accept className */}
              {filteredData?.icon && <filteredData.icon className="size-6" />}
              <span className="truncate text-2xl/9 font-bold tracking-tight dark:text-gray-100 text-gray-900">{filteredData?.title}</span>
            </div>
          </div>
  
          <div className="mt-6">
            <div className="gap-4 flex flex-wrap justify-center">
              {filteredData?.items?.map( (item, key) =>  {
                if (user.role !== 'admin' && item.url.includes('/admin')) {
                  return null;
                }
                
                return (
                  <TooltipProvider key={key+item.url}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link className="hover:text-inherit" to={item.url}>
                          <div className={`aspect-square flex flex-col h-40 items-center justify-center hover:border-${item.iconColor?.replace('text-', '')} ${item.bgColor} ${item.hoverColor} transition-colors duration-200 bg-cover border rounded-xl shadow bg-muted/50`}>
                            <div className={`p-3 rounded-lg ${item.bgColor} ${item.iconColor}`}>
                              {/* @ts-expect-error - icon component does accept className */}
                              <item.icon className="h-6 w-6" />
                            </div>
                            <span className={`text-center hover:${item.iconColor}`}>{item.title}</span>
                          </div>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        {item.description}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          </div>
        </div>
      </>
    )
}
  