import { useState } from "react"
import { Search, Sparkles, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface QuestionInputProps {
  onSubmit: (question: string, topicHint?: string) => void
  isLoading?: boolean
  placeholder?: string
  examples?: Array<{
    id: string
    title: string
    question: string
    topic: string
    difficulty: string
  }>
}

export function QuestionInput({ onSubmit, isLoading = false, placeholder = "Example: If 2.0 L of gas at 1.5 atm is compressed to 0.75 L at constant temperature, what is the new pressure?", examples = [] }: QuestionInputProps) {
  const [question, setQuestion] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<string>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      onSubmit(question.trim(), selectedTopic)
    }
  }

  const handleExampleClick = (example: any) => {
    setQuestion(example.question)
    setSelectedTopic(example.topic)
  }

  const displayExamples = examples.length > 0 ? examples : [
    {
      id: "1",
      title: "Boyle's Law Problem",
      question: "If 2.0 L of gas at 1.5 atm is compressed to 0.75 L at constant temperature, what is the new pressure?",
      topic: "gas-laws",
      difficulty: "beginner"
    },
    {
      id: "2", 
      title: "Stoichiometry Calculation",
      question: "How many grams of CO2 are produced when 10.0 g of propane (C3H8) burns completely?",
      topic: "stoichiometry",
      difficulty: "intermediate"
    },
    {
      id: "3",
      title: "Ideal Gas Law",
      question: "A 5.00 L container holds 2.00 mol of an ideal gas at 300 K. What is the pressure in atm?",
      topic: "gas-laws", 
      difficulty: "beginner"
    }
  ]

  return (
    <Card className="w-full shadow-card border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-primary" />
          Ask a Chemistry Question
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Type your question in natural language and get step-by-step solutions
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder={placeholder}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px] resize-none text-base"
            />
            {selectedTopic && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Topic hint:</span>
                <Badge variant="secondary" className="text-xs">
                  {selectedTopic}
                </Badge>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={!question.trim() || isLoading}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Solving...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Solve Problem
              </>
            )}
          </Button>
        </form>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <BookOpen className="h-4 w-4" />
            Try these examples:
          </div>
          
          <div className="grid gap-2">
            {displayExamples.map((example) => (
              <Card
                key={example.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30 border-border/30"
                onClick={() => handleExampleClick(example)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground mb-1">
                        {example.title}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {example.question}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end flex-shrink-0">
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        {example.topic}
                      </Badge>
                      <Badge 
                        variant={example.difficulty === 'beginner' ? 'default' : 'secondary'} 
                        className="text-xs px-2 py-0.5"
                      >
                        {example.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}