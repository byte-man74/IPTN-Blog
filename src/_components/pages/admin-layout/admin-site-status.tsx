import { Skeleton } from "@/_components/global/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { useFetchSiteConfig } from "@/network/http-service/site-config.hooks"
import { Progress } from "@radix-ui/react-progress"
import { AlertTriangle } from "lucide-react"
import { PageCheck } from "./admin-page-check"

// Temporary mock news data
const MOCK_NEWS = {
  data: [
    {
      id: '1',
      title: 'Test Article 1',
      categories: [{ id: 1, name: 'Category 1' }],
      isFeatured: true,
      isBreakingNews: true,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Test Article 2',
      categories: [{ id: 1, name: 'Category 1' }],
      isFeatured: false,
      isBreakingNews: false,
      createdAt: new Date(),
    },
  ]
}

// Site Status Dashboard component
export const SiteStatusDashboard = () => {
    const { data: siteConfig, isLoading: configLoading } = useFetchSiteConfig()
    const news = MOCK_NEWS
    const newsLoading = false

    // Generate status checks for each key category
    const generateStatusChecks = () => {
      if (!siteConfig || !news) return []

      return siteConfig.navBarKeyCategories.map((category) => {
        const issues: string[] = []

        // Check for featured news
        const hasFeaturedNews = news.data.some((item) => {
          const itemCategories = item.categories || []
          return itemCategories.some((cat) => cat.id === category.id) && (item.isFeatured || false)
        })

        if (!hasFeaturedNews) {
          issues.push(`No featured news item for this category`)
        }

        // Check for recent content (within last 7 days)
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        const hasRecentContent = news.data.some((item) => {
          const itemCategories = item.categories || []
          const publishDate = item.createdAt
          return (
            itemCategories.some((cat) => cat.id === category.id) && new Date(publishDate) > oneWeekAgo
          )
        })

        if (!hasRecentContent) {
          issues.push(`No recent content (last 7 days)`)
        }

        // Check for minimum number of articles (at least 3)
        const categoryNewsCount = news.data.filter((item) => {
          const itemCategories = item.categories || []
          return itemCategories.some((cat) => cat.id === category.id)
        }).length

        if (categoryNewsCount < 3) {
          issues.push(`Only ${categoryNewsCount} articles (minimum 3 recommended)`)
        }

        return {
          category,
          issues,
        }
      })
    }

    // Check for breaking news
    const checkBreakingNews = () => {
      if (!news) return []

      const issues: string[] = []
      const hasBreakingNews = news.data.some((item) => item.isBreakingNews === true)

      if (!hasBreakingNews) {
        issues.push('No breaking news currently set')
      }

      return issues
    }

    // Calculate overall health score
    const calculateHealthScore = () => {
      if (!siteConfig || !news) return 0

      const checks = generateStatusChecks()
      const totalIssues =
        checks.reduce((count, check) => count + check.issues.length, 0) + checkBreakingNews().length

      const totalPossibleIssues = checks.length * 3 + 1 // 3 checks per category + breaking news

      return Math.max(0, 100 - (totalIssues / totalPossibleIssues) * 100)
    }

    if (configLoading || newsLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      )
    }

    const statusChecks = generateStatusChecks()
    const breakingNewsIssues = checkBreakingNews()
    const healthScore = calculateHealthScore()

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-1">Content Health Dashboard</h3>
            <p className="text-muted-foreground">
              Check the status of your site&apos;s content requirements
            </p>
          </div>
          <Card className="p-4 w-full lg:w-64">
            <div className="text-center">
              <div className="text-sm font-medium mb-2">Overall Health</div>
              <Progress value={healthScore} className="h-2 mb-2" />
              <div className="text-2xl font-bold">{healthScore.toFixed(0)}%</div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PageCheck categoryName="Breaking News" issues={breakingNewsIssues} />

          {statusChecks.map((check, index) => (
            <PageCheck key={index} categoryName={check.category.name} issues={check.issues} />
          ))}
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Content Tips</AlertTitle>
          <AlertDescription>
            Keep your site content fresh by regularly updating featured content and ensuring each
            category has recent articles. Having breaking news increases user engagement.
          </AlertDescription>
        </Alert>
      </div>
    )
  }
