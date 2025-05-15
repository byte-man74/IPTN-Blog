import { Calendar, Clock} from "lucide-react"
import type React from "react"
import { AppLink } from "@/_components/global/app-link"
import type { NewsDTO } from "@/app/(server)/modules/news/news.types"
import { ClientRoutes } from "@/lib/routes/client"
import { cleanUpNewsTitle } from "@/app/(server)/modules/news/news.utils"

interface DarkerBasicNewsWithTagProps {
  newsItem?: NewsDTO
  backgroundColor?: string
}

const DarkerBasicNewsWithTag: React.FC<DarkerBasicNewsWithTagProps> = ({ newsItem, backgroundColor }) => {
  if (!newsItem) {
    return null
  }

  const { title, analytics, tags, pubDate, slug } = newsItem
  const readTime = analytics?.readDuration || ""
  const date = pubDate ? new Date(pubDate).toLocaleDateString() : ""
  const mainTag = tags ? tags[0] : undefined

  return (
    <div className="relative w-full h-full overflow-hidden group rounded-none shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
      <AppLink href={ClientRoutes.viewNews(slug)} className="block h-full">
        <div
          style={{ backgroundColor: backgroundColor ? backgroundColor : "#f3f4f6" }}
          className="w-full h-full p-4 sm:p-5 md:p-6 border-l-0 group-hover:border-l-2 group-hover:border-l-primaryGreen transition-all duration-300"
        >
          <div className="flex flex-col justify-between h-full">
            <h3 className="text-base sm:text-lg font-semibold leading-tight text-primaryDark mb-3 sm:mb-4 group-hover:text-primaryGreen transition-colors duration-300 line-clamp-3">
              {cleanUpNewsTitle(title) || ""}
            </h3>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm mt-auto">
              {readTime && (
                <div className="flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-105">
                  <div className="bg-primaryGreen/10 p-1.5 rounded-full group-hover:bg-primaryGreen transition-colors duration-300">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primaryGreen group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-gray-700 group-hover:text-primaryGreen transition-colors duration-300">{readTime}</span>
                </div>
              )}

              {mainTag && (
                <div className="bg-primaryGreen/10 px-2 py-1 rounded-sm group-hover:bg-primaryGreen transition-all duration-300">
                  <span className="text-primaryGreen text-xs font-medium group-hover:text-white transition-colors duration-300">{mainTag.name}</span>
                </div>
              )}

              {date && (
                <div className="flex items-center gap-1.5 ml-auto transition-transform duration-300 group-hover:scale-105">
                  <div className="bg-primaryGreen p-1.5 flex items-center justify-center rounded-full shadow-sm group-hover:shadow-md transition-all duration-300">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  </div>
                  <span className="text-gray-700 group-hover:text-primaryGreen transition-colors duration-300">{date}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </AppLink>
    </div>
  )
}

export default DarkerBasicNewsWithTag
