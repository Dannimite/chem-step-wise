import { useState } from "react"
import { FlaskConical, Sparkles, BookOpen, Calculator, ArrowRight, Beaker, Atom } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QuestionInput } from "@/components/chemistry/QuestionInput"
import { SolutionDisplay } from "@/components/chemistry/SolutionDisplay"
import { mockSolverResponse, mockExampleProblems } from "@/data/mockData"
import { SolverResponse } from "@/types/chemistry"
import { useNavigate } from "react-router-dom"

const Index = () => {
  const [solution, setSolution] = useState<SolverResponse>()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleQuestionSubmit = async (question: string, topicHint?: string) => {
    setIsLoading(true)
    // Simulate API call with actual problem solving
    setTimeout(() => {
      // Create a more dynamic solution based on the question
      const detectedTopic = question.toLowerCase().includes('pressure') || question.toLowerCase().includes('volume') ? 'gas-laws' :
                           question.toLowerCase().includes('mole') || question.toLowerCase().includes('react') ? 'stoichiometry' :
                           question.toLowerCase().includes('ph') || question.toLowerCase().includes('acid') ? 'ph' :
                           question.toLowerCase().includes('heat') || question.toLowerCase().includes('temperature') ? 'thermochemistry' :
                           'general-chemistry'
      
      setSolution({
        ...mockSolverResponse,
        detectedTopic,
        canonicalProblem: question
      })
      setIsLoading(false)
    }, 2000)
  }

  const featuredTopics = [
    {
      title: "Gas Laws",
      description: "Boyle's, Charles's, Gay-Lussac's laws and ideal gas calculations",
      icon: Beaker,
      path: "/gas-laws",
      gradient: "bg-gradient-primary",
      examples: 3
    },
    {
      title: "Stoichiometry", 
      description: "Mole calculations, limiting reagents, and reaction yields",
      icon: Calculator,
      path: "/stoichiometry", 
      gradient: "bg-gradient-secondary",
      examples: 5
    },
    {
      title: "Molar Mass",
      description: "Calculate molecular weights and formula masses",
      icon: Atom,
      path: "/molar-mass",
      gradient: "bg-accent", 
      examples: 4
    }
  ]

  return (
    <div className="container mx-auto max-w-6xl space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <FlaskConical className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">
            Chemistry Made
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Solve chemistry problems step-by-step with AI-powered explanations. 
            From gas laws to stoichiometry, get clear solutions with detailed mathematical breakdowns.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Sparkles className="h-3 w-3 mr-1" />
            Step-by-step solutions
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1">
            <BookOpen className="h-3 w-3 mr-1" />
            Interactive calculators
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1">
            <FlaskConical className="h-3 w-3 mr-1" />
            All chemistry topics
          </Badge>
        </div>
      </div>

      {/* Main Solver Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuestionInput 
          onSubmit={handleQuestionSubmit}
          isLoading={isLoading}
        />
        <SolutionDisplay 
          solution={solution}
          isLoading={isLoading}
        />
      </div>

      {/* Featured Topics */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Explore Topics</h2>
          <p className="text-muted-foreground">Interactive calculators and solved examples for every chemistry topic</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTopics.map((topic) => (
            <Card 
              key={topic.title} 
              className="group cursor-pointer border-border/30 hover:shadow-elegant hover:border-primary/30 transition-all duration-300"
              onClick={() => navigate(topic.path)}
            >
              <CardHeader className="pb-4">
                <div className="space-y-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${topic.gradient} shadow-md group-hover:shadow-glow transition-all duration-300`}>
                    <topic.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                        {topic.title}
                      </CardTitle>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {topic.examples} examples
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    Interactive calculators
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Examples */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Popular Examples</h2>
          <p className="text-muted-foreground">Try these commonly asked chemistry problems</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockExampleProblems.slice(0, 2).map((example) => (
            <Card 
              key={example.id}
              className="cursor-pointer border-border/30 hover:shadow-md hover:border-primary/30 transition-all duration-200"
              onClick={() => {
                // Navigate to appropriate topic page
                if (example.topicId === 'gas-laws') navigate('/gas-laws')
                if (example.topicId === 'stoichiometry') navigate('/stoichiometry')
              }}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="font-medium text-foreground">{example.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {example.question}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <Badge variant="outline" className="text-xs">
                        {example.topicId}
                      </Badge>
                      <Badge 
                        variant={example.difficulty === 'beginner' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {example.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="h-3 w-3" />
                    {example.solution.length} solution steps
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-12 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Ready to solve chemistry problems?</h2>
          <p className="text-muted-foreground">Start with any topic or ask a question above</p>
        </div>
        
        <Button 
          size="lg" 
          className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          onClick={() => navigate('/gas-laws')}
        >
          <FlaskConical className="mr-2 h-5 w-5" />
          Explore Topics
        </Button>
      </div>
    </div>
  );
};

export default Index;
