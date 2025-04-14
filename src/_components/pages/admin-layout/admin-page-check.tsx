import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";

// PageCheck component for status checks
export const PageCheck = ({ categoryName, issues }: { categoryName: string; issues: string[] }) => {
    const hasIssues = issues.length > 0

    return (
      <Card className={hasIssues ? 'border-yellow-400' : 'border-green-500'}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            {hasIssues ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            )}
            {categoryName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasIssues ? (
            <div className="space-y-2">
              {issues.map((issue, index) => (
                <Alert key={index} variant="default" className="py-2 border-yellow-400 bg-yellow-50">
                  <AlertDescription>{issue}</AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <Alert variant="default" className="py-2 border-green-500 bg-green-50">
              <AlertDescription>All content requirements met!</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }
