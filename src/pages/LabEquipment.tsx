import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Beaker, FlaskConical, Thermometer, Scale, TestTube, Microscope, Flame, Droplets, Zap, CircuitBoard } from "lucide-react";

const labEquipment = [
  {
    id: 1,
    name: "Beaker",
    icon: Beaker,
    description: "A cylindrical glass container with a flat bottom and a spout for pouring. Used for mixing, heating, and storing liquids.",
    uses: ["Mixing solutions", "Heating liquids", "General storage", "Precipitation reactions"],
    category: "Glassware"
  },
  {
    id: 2,
    name: "Erlenmeyer Flask",
    icon: FlaskConical,
    description: "A conical glass flask with a narrow neck. Ideal for swirling solutions without spillage and for titrations.",
    uses: ["Titrations", "Mixing without spillage", "Recrystallization", "Boiling solutions"],
    category: "Glassware"
  },
  {
    id: 3,
    name: "Test Tube",
    icon: TestTube,
    description: "A small cylindrical glass tube used for holding and mixing small amounts of chemicals during experiments.",
    uses: ["Small-scale reactions", "Qualitative analysis", "Sample storage", "Color change observations"],
    category: "Glassware"
  },
  {
    id: 4,
    name: "Thermometer",
    icon: Thermometer,
    description: "An instrument used to measure temperature accurately in chemical reactions and physical processes.",
    uses: ["Temperature monitoring", "Melting point determination", "Boiling point measurement", "Reaction control"],
    category: "Measurement"
  },
  {
    id: 5,
    name: "Analytical Balance",
    icon: Scale,
    description: "A highly precise weighing instrument capable of measuring mass to the nearest 0.0001 grams.",
    uses: ["Precise mass measurements", "Quantitative analysis", "Preparing standard solutions", "Stoichiometric calculations"],
    category: "Measurement"
  },
  {
    id: 6,
    name: "Microscope",
    icon: Microscope,
    description: "An optical instrument used to magnify small objects and observe crystal structures or microscopic samples.",
    uses: ["Crystal examination", "Particle analysis", "Quality control", "Research observations"],
    category: "Optical"
  },
  {
    id: 7,
    name: "Bunsen Burner",
    icon: Flame,
    description: "A gas burner that produces a hot, clean flame for heating substances and sterilizing equipment.",
    uses: ["Heating solutions", "Flame tests", "Sterilization", "Combustion reactions"],
    category: "Heating"
  },
  {
    id: 8,
    name: "Burette",
    icon: Droplets,
    description: "A graduated glass tube with a tap at the bottom, used to deliver precise volumes of liquid in titrations.",
    uses: ["Titrations", "Precise volume delivery", "Acid-base analysis", "Standardization procedures"],
    category: "Volumetric"
  },
  {
    id: 9,
    name: "pH Meter",
    icon: Zap,
    description: "An electronic instrument that measures the acidity or alkalinity of solutions with high precision.",
    uses: ["pH measurement", "Buffer preparation", "Quality control", "Environmental monitoring"],
    category: "Electronic"
  },
  {
    id: 10,
    name: "Conductivity Meter",
    icon: CircuitBoard,
    description: "An instrument that measures the electrical conductivity of solutions to determine ionic concentration.",
    uses: ["Solution analysis", "Water purity testing", "Ionic strength measurement", "Quality assessment"],
    category: "Electronic"
  }
];

const categories = [...new Set(labEquipment.map(item => item.category))];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Glassware": "bg-blue-100 text-blue-800 border-blue-200",
    "Measurement": "bg-green-100 text-green-800 border-green-200", 
    "Optical": "bg-purple-100 text-purple-800 border-purple-200",
    "Heating": "bg-red-100 text-red-800 border-red-200",
    "Volumetric": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Electronic": "bg-gray-100 text-gray-800 border-gray-200"
  };
  return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
};

export default function LabEquipment() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Laboratory Equipment</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Essential tools and instruments used in chemistry laboratories for accurate measurements, 
          safe handling of chemicals, and conducting experiments.
        </p>
      </div>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Microscope className="h-6 w-6" />
            Equipment Categories
          </CardTitle>
          <CardDescription>
            Laboratory equipment is organized into different categories based on their primary function
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant="outline" 
                className={getCategoryColor(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labEquipment.map((equipment) => {
          const IconComponent = equipment.icon;
          return (
            <Card key={equipment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-primary">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{equipment.name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getCategoryColor(equipment.category)}`}
                    >
                      {equipment.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {equipment.description}
                </CardDescription>
                
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2">Common Uses:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {equipment.uses.map((use, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Safety Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Safety Reminder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-amber-700 text-sm">
            Always follow proper safety protocols when using laboratory equipment. Wear appropriate 
            personal protective equipment (PPE), understand the proper operation of each instrument, 
            and ensure proper ventilation when working with chemicals or heat sources.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}