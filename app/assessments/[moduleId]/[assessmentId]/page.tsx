'use client'

import { useState } from 'react'
import AssessmentView from '@/app/components/assessments/AssessmentView'
import { ModuleCompletionModal } from '@/app/components/modules/ModuleCompletionModal'

interface AssessmentPageProps {
  params: {
    moduleId: string
    assessmentId: string
  }
}

export default function AssessmentPage({
  params
}: AssessmentPageProps) {
  const [showCompletion, setShowCompletion] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [assessmentPassed, setAssessmentPassed] = useState(false)

  const handleAssessmentComplete = (score: number, passed: boolean) => {
    setFinalScore(score)
    setAssessmentPassed(passed)
    if (passed) {
      setShowCompletion(true)
    }
  }

  return (
    <>
      {/* Assessment quiz */}
      <AssessmentView
        assessmentId={params.assessmentId}
        moduleId={params.moduleId}
        onComplete={handleAssessmentComplete}
      />

      {/* Show completion modal if passed */}
      <ModuleCompletionModal
        isOpen={showCompletion && assessmentPassed}
        moduleName="Módulo Completado"
        totalLessons={0}
        onClose={() => {
          setShowCompletion(false)
          // Redirect to next module or dashboard
        }}
      />
    </>
  )
}
