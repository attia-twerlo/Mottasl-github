import { ReactNode, useState } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { PageWrapper } from "@/components/page-wrapper"
import { PageHeader } from "@/components/page-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { NavigationProvider, useNavigationContext } from "@/hooks/use-navigation-context"
import { useAuth } from "@/hooks/use-auth"
import { NotificationProvider } from "@/contexts/notification-context"

interface DashboardLayoutProps {
  children: ReactNode
}

// Inner component that can access the navigation context
function DashboardContent({ children }: { children: ReactNode }) {
  const { isLoading: isNavigating } = useNavigationContext()
  const [searchValue, setSearchValue] = useState("")
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false)

  const handleGlobalSearch = (value: string) => {
    setSearchValue(value)
    // Handle global search functionality here
  }

  const handleSearchFocus = () => {
    setIsActionCenterOpen(true)
  }

  const handleActionCenterClose = () => {
    setIsActionCenterOpen(false)
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
          "--header-height-mobile": "calc(var(--spacing) * 16)",
        } as React.CSSProperties
      }
    >
      <div className="flex h-screen w-full max-w-full">
        <AppSidebar variant="inset" />
        <SidebarInset className="flex flex-1 flex-col sidebar-content-transition bg-white relative min-w-0">
          {/* Fixed Header - Transparent Background */}
          <div className="absolute top-0 left-0 right-0 z-80 pointer-events-auto h-[var(--header-height-mobile)] md:h-[var(--header-height)] w-full">
            <div className="bg-transparent backdrop-blur border-b border-border/20 overview-hidden rounded-xl h-full flex items-center w-full px-0">
              <div className="w-full">
                <PageHeader 
                showBreadcrumbs={true} 
                showSearch={true}
                searchPlaceholder="Find contacts, create campaigns, or discover actions"
                searchValue={searchValue}
                onSearchChange={handleGlobalSearch}
                onSearchFocus={handleSearchFocus}
                isActionCenterOpen={isActionCenterOpen}
                onActionCenterClose={handleActionCenterClose}
                isLoading={isNavigating} 
              />
              </div>
            </div>
          </div>
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative min-w-0 pt-[var(--header-height-mobile)] md:pt-[var(--header-height)]">
            <PageWrapper>
              {children}
            </PageWrapper>
            {/* Mobile-only safe area gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none md:hidden">
              <div 
                className="h-20 bg-gradient-to-t from-white to-transparent"
                style={{
                  background: 'linear-gradient(to top, white 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
                  paddingBottom: 'env(safe-area-inset-bottom, 0px)'
                }}
              />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show nothing if not authenticated (redirect will happen in AuthProvider)
  if (!isAuthenticated) {
    return null
  }

  return (
    <NotificationProvider>
      <NavigationProvider>
        <DashboardContent>
          {children}
        </DashboardContent>
      </NavigationProvider>
    </NotificationProvider>
  )
}
