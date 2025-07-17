
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { generateReportSummary } from "@/ai/flows/generate-report-summary"
import { Loader2 } from "lucide-react"

interface AiSummaryDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  reportType: string
  reportData: string
}

export function AiSummaryDialog({
  isOpen,
  onOpenChange,
  reportType,
  reportData,
}: AiSummaryDialogProps) {
  const [summary, setSummary] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (isOpen && reportType && reportData) {
      const getSummary = async () => {
        setIsLoading(true)
        setSummary("")
        try {
          const result = await generateReportSummary({ reportType, reportData })
          setSummary(result.summary)
        } catch (error) {
          console.error("Falha ao gerar resumo de IA:", error)
          setSummary("Desculpe, não conseguimos gerar um resumo neste momento.")
        } finally {
          setIsLoading(false)
        }
      }
      getSummary()
    }
  }, [isOpen, reportType, reportData])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resumo com IA</DialogTitle>
          <DialogDescription>
            Aqui está um resumo rápido do seu Relatório de {reportType}.
          </DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm dark:prose-invert max-h-80 overflow-y-auto rounded-lg border bg-secondary/30 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Gerando resumo...</span>
            </div>
          ) : (
            <p>{summary}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
