
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BMIData, 
  getCategoryColor, 
  formatWeight,
  formatHeight,
  getHealthTips
} from '@/utils/bmiCalculator';

interface BMIResultProps {
  data: BMIData;
}

const BMIResult: React.FC<BMIResultProps> = ({ data }) => {
  if (data.bmi === 0) return null;

  const categoryColor = getCategoryColor(data.category);
  const healthTip = getHealthTips(data.category);

  const getBMIScale = () => {
    const categories = [
      { range: '< 18.5', label: 'Underweight', color: 'bg-warning', width: '20%' },
      { range: '18.5-24.9', label: 'Normal', color: 'bg-success', width: '30%' },
      { range: '25-29.9', label: 'Overweight', color: 'bg-warning', width: '30%' },
      { range: '≥ 30', label: 'Obesity', color: 'bg-danger', width: '20%' }
    ];
    
    // Calculate position as percentage across the BMI scale (limits between 15-40)
    const bmiPosition = Math.min(Math.max(data.bmi, 15), 40);
    const positionPercentage = ((bmiPosition - 15) / 25) * 100;
    
    return (
      <div className="mt-4 mb-6">
        <div className="flex h-2 mb-1">
          {categories.map((cat, idx) => (
            <div key={idx} className={`${cat.color} h-full`} style={{ width: cat.width }}></div>
          ))}
        </div>
        <div className="relative h-6">
          <div 
            className="absolute top-0 transform -translate-x-1/2"
            style={{ left: `${positionPercentage}%` }}
          >
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-primary mx-auto"></div>
            <div className="text-xs font-medium mt-1 text-center">{data.bmi}</div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="text-center" style={{ width: cat.width }}>
                <div>{cat.range}</div>
                <div>{cat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Your Results</CardTitle>
          <Badge className={`bg-${categoryColor}`}>
            {data.category.charAt(0).toUpperCase() + data.category.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center my-4">
          <div className="text-4xl font-bold text-primary">{data.bmi}</div>
          <div className="text-sm text-muted-foreground mt-1">Body Mass Index</div>
        </div>

        {getBMIScale()}

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Height:</span>
            <span className="font-medium">{formatHeight(data.height, data.unitSystem)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Weight:</span>
            <span className="font-medium">{formatWeight(data.weight, data.unitSystem)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ideal Weight Range:</span>
            <span className="font-medium">
              {formatWeight(data.idealWeightRange.min, data.unitSystem)} - {formatWeight(data.idealWeightRange.max, data.unitSystem)}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <h3 className="font-medium mb-2">Health Tip:</h3>
          <p className="text-sm">{healthTip}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BMIResult;
