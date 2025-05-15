"use client"

import { Facebook, Instagram, Mail, Phone, Twitter, Youtube } from "lucide-react"
import { AppLogo } from "@/_components/global/app-logo"
import { useFetchPopularTags } from "@/network/http-service/news.hooks"
import { DEFAULT_SITE_CONFIG_ORDER } from "@/app/(server)/modules/site-configurations/site-config.constants"
import { ClientRoutes } from "@/lib/routes/client"
import { AppLink } from "@/_components/global/app-link"
import { CompanyData } from "@/lib/constants/company-data"
import { useSignIn } from "@/providers/signin-provider"
import { signOut, useSession } from "next-auth/react"
import { useMixpanel } from "@/lib/third-party/mixpanel/context"
import { MixpanelActions } from "@/lib/third-party/mixpanel/events"


export default function Footer() {
  const { data: popularTags } = useFetchPopularTags()
  const { openSignInModal } = useSignIn()
  const { data: sessionData } = useSession()
  const { trackEvent } = useMixpanel()

  const handleSubscribe = () => {
    // Open sign-in modal with newsletter context
    trackEvent({
      eventName: MixpanelActions.ATTEMPTED_TO_CONTACT,
      properties: { action: "newsletter_subscribe" }
    })
    openSignInModal()
  }

  const handleUnsubscribe = () => {
    trackEvent({
      eventName: MixpanelActions.UNSUBSCRIBED,
      properties: { email: sessionData?.user?.email }
    })
    signOut({ callbackUrl: '/' });
  }

  const handleSocialClick = (platform: string) => {
    trackEvent({
      eventName: MixpanelActions.CLICKED_SOCIAL_LINK,
      properties: { platform }
    })
  }

  const handleContactClick = (method: string, value: string) => {
    trackEvent({
      eventName: MixpanelActions.ATTEMPTED_TO_CONTACT,
      properties: { method, value }
    })
  }

  const handleTagClick = (tagName: string) => {
    trackEvent({
      eventName: MixpanelActions.SEARCHED_CONTENT,
      properties: { tag: tagName }
    })
  }


  return (
    <footer className="bg-[#171717] text-white py-4 sm:py-6 px-4 sm:px-6 md:px-12 mt-10">
      <div className="mx-auto bg-[#1D1D1D] p-6 sm:p-8 md:p-12 px-4 sm:px-10 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-16">
          {/* Newsletter Section */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-1">Let&apos;s</h2>
              <h2 className="text-3xl sm:text-4xl font-bold">Connect.</h2>
            </div>

            {sessionData?.user ? (
              <>
                <p className="text-gray-400 text-sm sm:text-base">
                  You&apos;re subscribed with <span className="text-primaryGreen font-medium">{sessionData.user.email}</span>.
                  You&apos;ll receive our exclusive news and updates.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleUnsubscribe}
                    className="border border-gray-500 hover:border-gray-400 text-gray-300 hover:text-white px-6 py-3 rounded-md transition-colors duration-300 w-full sm:w-auto"
                    aria-label="Unsubscribe from newsletter"
                  >
                    Unsubscribe from newsletter
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-400 text-sm sm:text-base">
                  Subscribe to our exclusive newsletter to receive exclusive news. Sign in with Google and check the newsletter option to subscribe.
                </p>

                <button
                  onClick={handleSubscribe}
                  className="bg-primaryGreen hover:bg-primaryGreen/80 text-white px-6 py-3 rounded-md transition-colors duration-300 w-full sm:w-auto"
                >
                  Sign in to Subscribe to newsletter
                </button>
              </>
            )}

            <div className="flex space-x-6 pt-2 sm:pt-4 justify-center sm:justify-start">
              <AppLink
                href={CompanyData.YoutubeLink}
                aria-label="YouTube"
                className="transition-transform hover:scale-110 duration-300"
                onClick={() => handleSocialClick("YouTube")}
              >
                <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-primaryGreen transition-colors duration-300" />
              </AppLink>
              <AppLink
                href={CompanyData.TwitterLink}
                aria-label="Twitter"
                className="transition-transform hover:scale-110 duration-300"
                onClick={() => handleSocialClick("Twitter")}
              >
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-primaryGreen transition-colors duration-300" />
              </AppLink>
              <AppLink
                href={CompanyData.InstagramLink}
                aria-label="Instagram"
                className="transition-transform hover:scale-110 duration-300"
                onClick={() => handleSocialClick("Instagram")}
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-primaryGreen transition-colors duration-300" />
              </AppLink>
              <AppLink
                href={CompanyData.FacebookLink}
                aria-label="Facebook"
                className="transition-transform hover:scale-110 duration-300"
                onClick={() => handleSocialClick("Facebook")}
              >
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-primaryGreen transition-colors duration-300" />
              </AppLink>
            </div>
          </div>

          {/* Links and Topics */}
          <div className="grid grid-cols-2 gap-6 sm:gap-10 mt-6 md:mt-0">
            {/* Links Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-primaryGreen">Links</h3>
              <ul className="space-y-3 sm:space-y-4">
                {DEFAULT_SITE_CONFIG_ORDER.contentTypes.map((contentType, index) => (
                  <li key={index} className="flex items-center group">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primaryGreen flex items-center justify-center mr-2 group-hover:bg-primaryGreen/80 transition-colors duration-300">
                      <svg
                        className="w-2 h-2 sm:w-3 sm:h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <AppLink
                      href={`/${contentType}`}
                      className="text-sm sm:text-base hover:text-primaryGreen transition-colors duration-300 capitalize"
                    >
                      {contentType}
                    </AppLink>
                  </li>
                ))}
                <li className="flex items-center group">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primaryGreen flex items-center justify-center mr-2 group-hover:bg-primaryGreen/80 transition-colors duration-300">
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <AppLink
                    href={ClientRoutes.explore}
                    className="text-sm sm:text-base hover:text-primaryGreen transition-colors duration-300"
                  >
                    Explore
                  </AppLink>
                </li>
              </ul>
            </div>

            {/* Topics Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-primaryGreen">Popular Tags</h3>
              <ul className="space-y-3 sm:space-y-4">
                {popularTags?.slice(0, 5).map((tag, index) => (
                  <li key={index} className="flex items-center group">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primaryGreen flex items-center justify-center mr-2 group-hover:bg-primaryGreen/80 transition-colors duration-300">
                      <svg
                        className="w-2 h-2 sm:w-3 sm:h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <AppLink
                      href={`${ClientRoutes.explore}?tag=${tag.name}`}
                      className="text-sm sm:text-base hover:text-primaryGreen transition-colors duration-300"
                      onClick={() => handleTagClick(tag.name)}
                    >
                      {tag.name}
                    </AppLink>
                  </li>
                ))}
                {(!popularTags || popularTags.length === 0) && (
                  <li className="text-sm sm:text-base text-gray-400">No tags available</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 my-6 sm:my-8 md:my-10"></div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center space-x-4 justify-start">
            <AppLink
              href={`tel:${CompanyData.PhoneNumber}`}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#262626] border border-primaryGreen flex items-center justify-center hover:border-primaryGreen/80 transition-colors duration-300"
              onClick={() => handleContactClick("phone", CompanyData.PhoneNumber)}
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primaryGreen" />
            </AppLink>
            <div>
              <h4 className="font-bold text-primaryGreen text-sm sm:text-base">Phone</h4>
              <AppLink
                href={`tel:${CompanyData.PhoneNumber}`}
                className="text-gray-400 text-xs sm:text-sm hover:text-primaryGreen transition-colors"
                onClick={() => handleContactClick("phone", CompanyData.PhoneNumber)}
              >
                {CompanyData.PhoneNumber}
              </AppLink>
            </div>
          </div>

          <div className="flex items-center space-x-4 justify-start">
            <AppLink
              href={`mailto:${CompanyData.Email}`}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#262626] border border-primaryGreen flex items-center justify-center hover:border-primaryGreen/80 transition-colors duration-300"
              onClick={() => handleContactClick("email", CompanyData.Email)}
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primaryGreen" />
            </AppLink>
            <div>
              <h4 className="font-bold text-primaryGreen text-sm sm:text-base">Email</h4>
              <AppLink
                href={`mailto:${CompanyData.Email}`}
                className="text-gray-400 text-xs sm:text-sm hover:text-primaryGreen transition-colors"
                onClick={() => handleContactClick("email", CompanyData.Email)}
              >
                {CompanyData.Email}
              </AppLink>
            </div>
          </div>

          <div className="flex justify-center md:justify-end mt-6 md:mt-0">
            <div className="transform scale-75 sm:scale-90 md:scale-100">
              <AppLogo />
            </div>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-10 text-gray-500 text-xs sm:text-sm">© Copyright {new Date().getFullYear()}. All rights reserved by {CompanyData.CompanyName}.</div>
      </div>
    </footer>
  )
}
