import { ReactNode, useEffect, useState } from 'react'
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
          "--header-height": "calc(var(--spacing) * 14)",
          "--header-height-mobile": "calc(var(--spacing) * 18)",
        } as React.CSSProperties
      }
    >
      <div className="flex h-screen w-full max-w-full">
        <AppSidebar variant="inset" />
        <SidebarInset className="flex flex-1 flex-col sidebar-content-transition bg-white relative min-w-0">
          <div
            className="flex-1 overflow-y-auto overscroll-contain overflow-hidden relative min-w-0 scroll-smooth"
            id="dashboard-scroll"
            data-scroll-container
          >
            {/* Sticky Header inside scroll context */}
            <div
              className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-border/30 transition-shadow rounded-t-xl overflow-hidden"
              data-header
            >
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
                className="py-4 sm:py-5"
              />
            </div>
            {/* Page Content */}
            <PageWrapper>
              {children}
            </PageWrapper>
            {/* Bottom space handled via PageWrapper padding (mobile only) */}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()
  // Optional runtime toggle (could be lifted to config): set to false to disable iOS guard
  const ENABLE_IOS_GUARD = true

  useEffect(() => {
    if (!ENABLE_IOS_GUARD) return
    const ua = navigator.userAgent || navigator.vendor
    const isiOS = /iPad|iPhone|iPod/.test(ua) || ("platform" in navigator && /Mac/.test((navigator as any).platform) && 'ontouchend' in document)
    if (!isiOS) return

    const scroller = document.getElementById('dashboard-scroll') as HTMLDivElement | null
    if (!scroller) return

    let startY = 0
    let startScrollTop = 0

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
      startScrollTop = scroller.scrollTop
    }

    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY
      const diff = currentY - startY
      const scrollingDown = diff < 0 // finger moving up
      const scrollingUp = diff > 0
      const atTop = scroller.scrollTop <= 0
      const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1

      // Prevent bounce when user tries to pull past top or push past bottom
      if ((atTop && scrollingUp) || (atBottom && scrollingDown)) {
        e.preventDefault()
      }
    }

    scroller.addEventListener('touchstart', onTouchStart, { passive: true })
    scroller.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      scroller.removeEventListener('touchstart', onTouchStart)
      scroller.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

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
        <div className="relative h-full w-full overflow-hidden">
          <DashboardContent>
            {children}
          </DashboardContent>
        </div>
      </NavigationProvider>
    </NotificationProvider>
  )
}
