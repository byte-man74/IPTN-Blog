'use client'

import React, { useState } from 'react'
import { AlertTriangle, CheckCircle, RotateCw, RefreshCw, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useHealthCheck } from '@/network/http-service/site-config.mutations'
import { useFetchSiteConfig } from '@/network/http-service/site-config.hooks'
import {
  SiteHealthReport,
  ContentHealthResult,
  CategoryHealthReport,
} from '@/app/(server)/modules/site-configurations/site-config.types'

// ContentCheck component for displaying a single content check
const ContentCheckItem = ({ check }: { check: ContentHealthResult }) => {
  const statusColor =
    check.status === 'error'
      ? 'text-red-500'
      : check.status === 'warning'
        ? 'text-yellow-500'
        : 'text-green-500'

  const icon =
    check.status === 'error' ? (
      <AlertTriangle className="h-5 w-5" />
    ) : check.status === 'warning' ? (
      <AlertTriangle className="h-5 w-5" />
    ) : (
      <CheckCircle className="h-5 w-5" />
    )

  return (
    <div className="flex items-start gap-2 py-1.5">
      <div className={statusColor}>{icon}</div>
      <div>
        <p className="text-sm font-medium">{check.message}</p>
        {check.details && (
          <div className="flex items-center gap-2 mt-1">
            <div className="text-xs text-muted-foreground">
              {check.details.current}/{check.details.required} required
              {check.details.isFresh !== undefined && (
                <span className={check.details.isFresh ? 'text-green-500' : 'text-yellow-500'}>
                  {check.details.isFresh ? ' • Fresh' : ' • Stale'}
                </span>
              )}
              {check.details.maxThreshold !== undefined &&
                check.details.current > check.details.maxThreshold && (
                  <span className="text-yellow-500">
                    {' '}
                    • Exceeds max ({check.details.maxThreshold})
                  </span>
                )}
            </div>
            <div className="flex-1">
              <Progress
                value={(check.details.current / check.details.required) * 100}
                className="h-1.5"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// CategoryHealthCard component for displaying a category's health
const CategoryHealthCard = ({ report }: { report: CategoryHealthReport }) => {
  const borderColor =
    report.overallStatus === 'error'
      ? 'border-red-300'
      : report.overallStatus === 'warning'
        ? 'border-yellow-300'
        : 'border-green-300'

  const statusBg =
    report.overallStatus === 'error'
      ? 'bg-red-50'
      : report.overallStatus === 'warning'
        ? 'bg-yellow-50'
        : 'bg-green-50'

  return (
    <Card className={`${borderColor} ${statusBg}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{report.categoryName}</span>
          <Badge variant={report.overallStatus === 'healthy' ? 'outline' : 'destructive'}>
            {report.overallStatus === 'healthy'
              ? 'All Clear'
              : report.overallStatus === 'warning'
                ? 'Warning'
                : 'Issues'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {report.checks.map((check, index) => (
            <ContentCheckItem key={index} check={check} />
          ))}
          {report.checks.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No specific checks for this category
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Main site status dashboard component
export const SiteStatusDashboard = () => {
  const { data: siteConfig, isLoading: configLoading } = useFetchSiteConfig()
  const [healthReport, setHealthReport] = useState<SiteHealthReport | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const healthCheckMutation = useHealthCheck()

  // Run a health check
  const runHealthCheck = async () => {
    setIsChecking(true)
    try {
      const result = await healthCheckMutation.mutateAsync({ data: undefined })
      setHealthReport(result)
    } finally {
      setIsChecking(false)
    }
  }

  // Calculate health score percentage for progress display
  const calculateHealthScore = () => {
    if (!healthReport) return 0

    const allChecks = [
      ...healthReport.homePageHealth,
      ...healthReport.categoryHealth.flatMap((cat) => cat.checks),
    ]

    const totalChecks = allChecks.length
    if (totalChecks === 0) return 100

    const healthyChecks = allChecks.filter((check) => check.status === 'healthy').length
    const warningChecks = allChecks.filter((check) => check.status === 'warning').length

    // Healthy checks count fully, warnings count as half
    return Math.round(((healthyChecks + warningChecks * 0.5) / totalChecks) * 100)
  }

  if (configLoading) {
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

  if (!siteConfig || !siteConfig.navBarKeyCategories.length) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertTitle>Configuration Required</AlertTitle>
        <AlertDescription>
          Please configure the site navigation before checking content health.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header & Health Score */}
      <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-1">Content Health Dashboard</h3>
          <p className="text-muted-foreground">
            Check the status of your site&apos;s content requirements
          </p>
        </div>

        {healthReport ? (
          <Card className="p-4 w-full lg:w-64">
            <div className="text-center">
              <div className="text-sm font-medium mb-2">Overall Health</div>
              <Progress value={calculateHealthScore()} className="h-2 mb-2" />
              <div className="text-2xl font-bold">{calculateHealthScore()}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                Last checked: {new Date(healthReport.lastCheckedAt).toLocaleString()}
              </div>
            </div>
          </Card>
        ) : (
          <Button onClick={runHealthCheck} disabled={isChecking} className="w-full lg:w-auto">
            {isChecking ? (
              <>
                <RotateCw className="h-4 w-4 mr-2 animate-spin" /> Running health check...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" /> Run content health check
              </>
            )}
          </Button>
        )}
      </div>

      <Separator />

      {healthReport ? (
        <div className="space-y-6">
          {/* Home Page Health */}
          {healthReport.homePageHealth.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Home Page</h4>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    {healthReport.homePageHealth.map((check, index) => (
                      <ContentCheckItem key={index} check={check} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Category Health */}
          {healthReport.categoryHealth.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Category Health</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthReport.categoryHealth.map((report) => (
                  <CategoryHealthCard key={report.categoryId} report={report} />
                ))}
              </div>
            </div>
          )}

          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Content Tips</AlertTitle>
            <AlertDescription>
              Keep your site content fresh by regularly updating featured content and ensuring each
              category has recent articles. Having breaking news increases user engagement.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button onClick={runHealthCheck} disabled={isChecking} variant="outline">
              {isChecking ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" /> Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh health check
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
          <h4 className="text-xl font-semibold mb-2">No Health Data Available</h4>
          <p className="text-muted-foreground max-w-md mb-6">
            Run a content health check to see the status of your site&apos;s content requirements
            and identify areas that need attention.
          </p>
          <Button onClick={runHealthCheck} disabled={isChecking} size="lg">
            {isChecking ? (
              <>
                <RotateCw className="h-4 w-4 mr-2 animate-spin" /> Running health check...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" /> Run content health check
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
