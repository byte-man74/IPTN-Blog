import { Calendar, Clock, Tag } from "lucide-react"
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
  const readTime = analytics?.readDuration || "3 mins read"
  const date = pubDate ? new Date(pubDate).toLocaleDateString() : "Date not available"
  const mainTag = tags ? tags[0] : undefined

  return (
    <div className="relative w-full h-full overflow-hidden group">
      <AppLink href={ClientRoutes.viewNews(slug)} className="block h-full">
        <div
          style={{ backgroundColor: backgroundColor ? backgroundColor : "#f3f4f6" }}
          className="w-full h-full p-6 hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex flex-col justify-between h-full">
            <h3 className="text-lg font-semibold leading-tight text-primaryDark mb-4">
              {cleanUpNewsTitle(title) || ""}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              {readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-primaryGreen" />
                  <span>{readTime}</span>
                </div>
              )}

              {mainTag && (
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4 text-primaryGreen" />
                  <span className="text-primaryGreen">{mainTag.name}</span>
                </div>
              )}

              {date && (
                <div className="flex items-center gap-1">
                    <div className="bg-primaryGreen p-1.5 flex items-center justify-center rounded-full">
                    <Calendar className="w-4 h-4 text-white" />
                    </div>

                  <span>{date}</span>
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
