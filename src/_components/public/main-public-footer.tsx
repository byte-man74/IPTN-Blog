import { Facebook, Instagram, Mail, Phone, Twitter, Youtube } from "lucide-react"
import Link from "next/link"
import { AppLogo } from "../global/app-logo"

export default function Footer() {
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

            <p className="text-gray-400 text-sm sm:text-base">
              Subscribe to our exclusive newsletter to receive exclusive news. Sign up by entering your mail below
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                placeholder="Email address"
                className="bg-white border border-gray-700 rounded-md sm:rounded-l-md sm:rounded-r-none px-4 py-3 w-full text-gray-800 focus:outline-none focus:border-primaryGreen"
              />
              <button className="bg-primaryGreen hover:bg-primaryGreen/80 text-white px-6 py-3 rounded-md sm:rounded-l-none sm:rounded-r-md transition-colors duration-300">Subscribe</button>
            </div>

            <div className="flex space-x-6 pt-2 sm:pt-4 justify-center sm:justify-start">
              <Link href="#" aria-label="YouTube" className="transition-transform hover:scale-110 duration-300">
                <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-primaryGreen transition-colors duration-300" />
              </Link>
              <Link href="#" aria-label="Twitter" className="transition-transform hover:scale-110 duration-300">
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-primaryGreen transition-colors duration-300" />
              </Link>
              <Link href="#" aria-label="Instagram" className="transition-transform hover:scale-110 duration-300">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-primaryGreen transition-colors duration-300" />
              </Link>
              <Link href="#" aria-label="Facebook" className="transition-transform hover:scale-110 duration-300">
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-primaryGreen transition-colors duration-300" />
              </Link>
            </div>
          </div>

          {/* Links and Topics */}
          <div className="grid grid-cols-2 gap-6 sm:gap-10 mt-6 md:mt-0">
            {/* Links Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-primaryGreen">Links</h3>
              <ul className="space-y-3 sm:space-y-4">
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
                  <Link href="#" className="text-sm sm:text-base hover:text-primaryGreen transition-colors duration-300">
                    News
                  </Link>
                </li>
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
                  <Link href="#" className="text-sm sm:text-base hover:text-primaryGreen transition-colors duration-300">
                    Blogs
                  </Link>
                </li>
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
                  <Link href="#" className="text-sm sm:text-base hover:text-primaryGreen transition-colors duration-300">
                    Articles
                  </Link>
                </li>
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
                  <Link href="#" className="text-sm sm:text-base hover:text-primaryGreen transition-colors duration-300">
                    Entertainment
                  </Link>
                </li>
              </ul>
            </div>

            {/* Topics Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-primaryGreen">Topics</h3>
              <ul className="space-y-3 sm:space-y-4">
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
                  <Link href="#" className="text-sm sm:text-base hover:text-primaryGreen transition-colors duration-300">
                    Politics
                  </Link>
                </li>
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
                  <Link href="#" className="text-sm sm:text-base hover:text-primaryGreen transition-colors duration-300">
                    Entertainment
                  </Link>
                </li>
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
                  <Link href="#" className="text-sm sm:text-base hover:text-primaryGreen transition-colors duration-300">
                    Lifestyle
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 my-6 sm:my-8 md:my-10"></div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center space-x-4 justify-start">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#262626] border border-primaryGreen flex items-center justify-center hover:border-primaryGreen/80 transition-colors duration-300">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primaryGreen" />
            </div>
            <div>
              <h4 className="font-bold text-primaryGreen text-sm sm:text-base">Phone</h4>
              <p className="text-gray-400 text-xs sm:text-sm">(+234) 811-8394-9489</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 justify-start">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#262626] border border-primaryGreen flex items-center justify-center hover:border-primaryGreen/80 transition-colors duration-300">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primaryGreen" />
            </div>
            <div>
              <h4 className="font-bold text-primaryGreen text-sm sm:text-base">Email</h4>
              <p className="text-gray-400 text-xs sm:text-sm">Webteam@ipledge2nigeria.net</p>
            </div>
          </div>

          <div className="flex justify-center md:justify-end mt-6 md:mt-0">
            <div className="transform scale-75 sm:scale-90 md:scale-100">
              <AppLogo />
            </div>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-10 text-gray-500 text-xs sm:text-sm">© Copyright 2025. All rights reserved.</div>
      </div>
    </footer>
  )
}
