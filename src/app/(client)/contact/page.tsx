import { ContactMainComponent } from '@/_components/pages/contact/main'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Get in Touch',
  description: 'Reach out to our team for general inquiries, technical support, feedback, or business opportunities. We are here to help.',
  keywords: 'contact, support, help, inquiries, feedback, business',
  openGraph: {
    title: 'Contact Us | Get in Touch',
    description: 'Reach out to our team for general inquiries, technical support, feedback, or business opportunities.',
    type: 'website',
  }
}

export default function ContactUsPage() {
  return (
    <ContactMainComponent />
  )
}
