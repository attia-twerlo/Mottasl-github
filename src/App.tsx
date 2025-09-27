import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/hooks/use-auth'
import { Toaster } from '@/components/ui/sonner'
// appConfig removed as it's not used in Vite version

// Layout components
import RootLayout from '@/layouts/RootLayout'
import LoginLayout from '@/layouts/LoginLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

// Pages
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import DashboardPage from '@/pages/DashboardPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import CampaignsPage from '@/pages/CampaignsPage'
import CampaignsCreatePage from '@/pages/CampaignsCreatePage'
import CampaignsSettingsPage from '@/pages/CampaignsSettingsPage'
import CampaignsTemplatesPage from '@/pages/CampaignsTemplatesPage'
import CampaignsAiBotsPage from '@/pages/CampaignsAiBotsPage'
import ContactsPage from '@/pages/ContactsPage'
import ContactsCreatePage from '@/pages/ContactsCreatePage'
import ContactDetailPage from '@/pages/ContactDetailPage'
import MessagesPage from '@/pages/MessagesPage'
import NotificationsPage from '@/pages/NotificationsPage'
import SettingsPage from '@/pages/SettingsPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <LoginLayout>
            <LoginPage />
          </LoginLayout>
        } />
        <Route path="/signup" element={
          <LoginLayout>
            <SignupPage />
          </LoginLayout>
        } />
        
        {/* Protected routes */}
        <Route path="/" element={
          <RootLayout>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </RootLayout>
        } />
        <Route path="/analytics" element={
          <RootLayout>
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          </RootLayout>
        } />
        <Route path="/campaigns" element={
          <RootLayout>
            <DashboardLayout>
              <CampaignsPage />
            </DashboardLayout>
          </RootLayout>
        } />
        <Route path="/campaigns/create" element={
          <RootLayout>
            <DashboardLayout>
              <CampaignsCreatePage />
            </DashboardLayout>
          </RootLayout>
        } />
        <Route path="/campaigns/settings" element={
          <RootLayout>
            <DashboardLayout>
              <CampaignsSettingsPage />
            </DashboardLayout>
          </RootLayout>
        } />
        <Route path="/campaigns/templates" element={
          <RootLayout>
            <DashboardLayout>
              <CampaignsTemplatesPage />
            </DashboardLayout>
          </RootLayout>
        } />
        <Route path="/campaigns/ai-bots" element={
          <RootLayout>
            <DashboardLayout>
              <CampaignsAiBotsPage />
            </DashboardLayout>
          </RootLayout>
        } />
        <Route path="/contacts" element={
          <RootLayout>
            <DashboardLayout>
              <ContactsPage />
            </DashboardLayout>
          </RootLayout>
        } />
        <Route path="/contacts/create" element={
          <RootLayout>
            <DashboardLayout>
              <ContactsCreatePage />
            </DashboardLayout>
          </RootLayout>
        } />
        <Route path="/contacts/:id" element={
          <RootLayout>
            <DashboardLayout>
              <ContactDetailPage />
            </DashboardLayout>
          </RootLayout>
        } />
        <Route path="/messages" element={
          <RootLayout>
            <DashboardLayout>
              <MessagesPage />
            </DashboardLayout>
          </RootLayout>
        } />
        <Route path="/notifications" element={
          <RootLayout>
            <DashboardLayout>
              <NotificationsPage />
            </DashboardLayout>
          </RootLayout>
        } />
        <Route path="/settings" element={
          <RootLayout>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </RootLayout>
        } />
        
        {/* Redirect unmatched routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  )
}

export default App
