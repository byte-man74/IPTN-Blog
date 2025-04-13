import { AdminSettingsPageMainComponent } from '@/_components/pages/admin-layout/admin-user'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Settings | User Management',
  description: 'Manage user accounts, admin privileges, and account activation status',
  robots: 'noindex, nofollow',
}

export default function AdminSettingsPage() {
  return <AdminSettingsPageMainComponent />
}
