import { useState } from "react"
import { BookOpen, Search, Filter, Star, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockExampleProblems } from "@/data/mockData"
import { useNavigate } from "react-router-dom"

const Examples = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const navigate = useNavigate()

  const filteredExamples = mockExampleProblems.filter(example => {
    const matchesSearch = example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         example.question.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = selectedTopic === "all" || example.topicId === selectedTopic
    const matchesDifficulty = selectedDifficulty === "all" || example.difficulty === selectedDifficulty
    
    return matchesSearch && matchesTopic && matchesDifficulty
  })

  const handleExampleClick = (example: any) => {
    // Navigate to the appropriate topic page
    const topicRoutes: Record<string, string> = {
      'gas-laws': '/gas-laws',
      'stoichiometry': '/stoichiometry',
      'chemical-equations': '/equations',
      'molar-mass': '/molar-mass',
      'concentration': '/concentration',
      'ph': '/ph',
      'thermochemistry': '/thermochemistry'
    }
    
    const route = topicRoutes[example.topicId] || '/'
    navigate(route)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      case 'advanced': return 'bg-red-500/10 text-red-700 border-red-200'
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-foreground">Examples Library</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse through our collection of solved chemistry problems across all topics
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Search & Filter Examples
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Input
                placeholder="Search examples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="All Topics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  <SelectItem value="gas-laws">Gas Laws</SelectItem>
                  <SelectItem value="stoichiometry">Stoichiometry</SelectItem>
                  <SelectItem value="chemical-equations">Chemical Equations</SelectItem>
                  <SelectItem value="molar-mass">Molar Mass</SelectItem>
                  <SelectItem value="concentration">Concentration</SelectItem>
                  <SelectItem value="ph">pH & Acids/Bases</SelectItem>
                  <SelectItem value="thermochemistry">Thermochemistry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            Showing {filteredExamples.length} of {mockExampleProblems.length} examples
          </div>
        </CardContent>
      </Card>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExamples.map((example) => (
          <Card 
            key={example.id}
            className="group cursor-pointer border-border/30 hover:shadow-elegant hover:border-primary/30 transition-all duration-300"
            onClick={() => handleExampleClick(example)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {example.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {example.question}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {example.topicId.replace('-', ' ')}
                  </Badge>
                  <Badge 
                    className={`text-xs px-2 py-1 ${getDifficultyColor(example.difficulty)}`}
                  >
                    {example.difficulty}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {example.solution.length} solution steps
                  </div>
                  <div>
                    Click to solve
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExamples.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <div className="text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            No examples found matching your criteria
          </div>
          <Button 
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setSelectedTopic("all")
              setSelectedDifficulty("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default Examples