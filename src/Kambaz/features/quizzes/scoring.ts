import type { Question } from './types'

export type AnswerPayload =
  | { questionId: string; type: 'mcq'; choiceIndex: number | null }
  | { questionId: string; type: 'truefalse'; value: boolean | null }
  | { questionId: string; type: 'fillblank'; value: string }

export function scoreQuiz(questions: Question[], answers: AnswerPayload[]) {
  let score = 0
  const details = questions.map((q) => {
    const a = answers.find((x) => x.questionId === q._id)
    let correct = false

    switch (q.type) {
      case 'mcq':
        correct =
          !!a && a.type === 'mcq' && a.choiceIndex === (q as any).correctIndex
        break
      case 'truefalse':
        correct =
          !!a && a.type === 'truefalse' && a.value === (q as any).correct
        break
      case 'fillblank': {
        if (!a || a.type !== 'fillblank') break
        const v = (a.value ?? '').trim()
        const answers: string[] = (q as any).answers || []
        const ci = (q as any).caseInsensitive
        correct = answers.some((ans) =>
          ci ? ans.trim().toLowerCase() === v.toLowerCase() : ans.trim() === v,
        )
        break
      }
    }

    if (correct) score += q.points || 0
    return { questionId: q._id, correct }
  })

  return { score, details }
}
