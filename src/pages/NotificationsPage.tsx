import ComingSoon from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";
import { usePageTitle } from "@/hooks/use-dynamic-title";
import * as React from "react";

export default function NotificationsPage() {
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  
  // Dynamic page title
  usePageTitle("Notifications");

  // Simulate initial data loading from server
  React.useEffect(() => {
    setIsDataLoading(true);
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 400); // Standard 400ms loading time for server data

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <PageHeader
          title="Notifications"
          description="View and manage your notifications"
          showBreadcrumbs={false}
          isLoading={isDataLoading}
        />
        <ComingSoon isLoading={isDataLoading} />
      </div>
    </div>
  );
}
