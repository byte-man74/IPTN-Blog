'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Mail, MessageSquare} from 'lucide-react'
import { CompanyData } from '@/lib/constants/company-data'
import { AppLogoBlack } from '@/_components/global/app-logo-black'

export const ContactMainComponent = () => {
  const [contactReason, setContactReason] = useState<string>('')

  const contactReasons = [
    {
      id: 'general',
      label: 'General Inquiry',
      emailSubject: 'General Inquiry',
      message: 'Hello, I have a general question about your services.',
    },
    {
      id: 'support',
      label: 'Technical Support',
      emailSubject: 'Technical Support Request',
      message: 'Hello, I need technical assistance with your platform.',
    },
    {
      id: 'feedback',
      label: 'Feedback',
      emailSubject: 'Feedback',
      message: 'Hello, I would like to provide feedback about your services.',
    },
    {
      id: 'business',
      label: 'Business Opportunity',
      emailSubject: 'Business Opportunity',
      message: 'Hello, I would like to discuss a potential business opportunity.',
    },
  ]

  const handleEmailContact = () => {
    const selectedReason = contactReasons.find((reason) => reason.id === contactReason)
    if (!selectedReason) return

    const subject = encodeURIComponent(selectedReason.emailSubject)
    const body = encodeURIComponent(selectedReason.message)
    window.location.href = `mailto:${CompanyData.Email}?subject=${subject}&body=${body}`
  }

  const handleWhatsAppContact = () => {
    const selectedReason = contactReasons.find((reason) => reason.id === contactReason)
    if (!selectedReason) return

    const message = encodeURIComponent(selectedReason.message)
    window.location.href = `https://wa.me/${CompanyData.WhatsAppNumber}?text=${message}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation header */}
      <div className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center">
          <div className="mx-auto">
              <AppLogoBlack className='w-[14rem]' />
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto shadow-lg border-t-4 border-t-primaryGreen rounded-none">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-primaryGreen">Contact Us</CardTitle>
            <CardDescription className="text-base mt-2">
              Select a reason for contacting us and choose your preferred contact method
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <div className="space-y-8">
              <div className="bg-gray-50 p-5">
                <h3 className="text-lg font-medium mb-4 text-gray-800">
                  What would you like to contact us about?
                </h3>
                <RadioGroup
                  value={contactReason}
                  onValueChange={setContactReason}
                  className="space-y-3"
                >
                  {contactReasons.map((reason) => (
                    <div
                      key={reason.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-100 transition-colors"
                    >
                      <RadioGroupItem value={reason.id} id={reason.id} />
                      <Label htmlFor={reason.id} className="cursor-pointer font-medium">
                        {reason.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="pt-2 space-y-4">
                <h3 className="text-lg font-medium mb-4 text-gray-800">
                  Choose your contact method:
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleEmailContact}
                    disabled={!contactReason}
                    className="flex-1 flex items-center justify-center gap-2 py-6 bg-primaryGreen hover:bg-primaryGreen/90 transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    Contact via Email
                  </Button>
                  <Button
                    onClick={handleWhatsAppContact}
                    disabled={!contactReason}
                    className="flex-1 flex items-center justify-center gap-2 py-6 border-2 border-primaryGreen text-primaryGreen hover:bg-primaryGreen/10 transition-colors"
                    variant="outline"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Contact via WhatsApp
                  </Button>
                </div>
                {!contactReason && (
                  <p className="text-center text-sm text-amber-600 mt-2">
                    Please select a contact reason to continue
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
