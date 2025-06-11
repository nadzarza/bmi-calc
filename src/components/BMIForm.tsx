
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Save } from 'lucide-react';
import { 
  Gender,
  UnitSystem,
  calculateBMI, 
  getBMICategory, 
  calculateIdealWeight,
  convertHeight,
  convertWeight,
  BMIData
} from '@/utils/bmiCalculator';

interface BMIFormProps {
  onCalculate: (data: BMIData) => void;
  onSaveToHistory: (data: BMIData) => void;
}

const BMIForm: React.FC<BMIFormProps> = ({ onCalculate, onSaveToHistory }) => {
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number>(30);
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [currentData, setCurrentData] = useState<BMIData | null>(null);

  // Define slider ranges based on unit system
  const getHeightRange = () => {
    return unitSystem === 'metric' 
      ? { min: 100, max: 220, step: 1 } 
      : { min: 36, max: 84, step: 1 };
  };
  
  const getWeightRange = () => {
    return unitSystem === 'metric' 
      ? { min: 30, max: 150, step: 1 } 
      : { min: 66, max: 330, step: 1 };
  };

  const handleUnitSystemChange = (checked: boolean) => {
    const newUnitSystem: UnitSystem = checked ? 'imperial' : 'metric';
    
    // Convert existing values
    if (weight) {
      setWeight(
        Math.round(convertWeight(weight, unitSystem, newUnitSystem))
      );
    }
    
    if (height) {
      setHeight(
        Math.round(convertHeight(height, unitSystem, newUnitSystem))
      );
    }
    
    setUnitSystem(newUnitSystem);
  };

  const handleCalculate = () => {
    const bmiValue = calculateBMI(weight, height, unitSystem);
    const category = getBMICategory(bmiValue);
    const idealWeightRange = calculateIdealWeight(height, gender, unitSystem);

    const result: BMIData = {
      bmi: bmiValue,
      weight: weight,
      height: height,
      age: age,
      gender,
      category,
      idealWeightRange,
      date: new Date().toISOString(),
      unitSystem
    };

    setCurrentData(result);
    onCalculate(result);
  };

  const handleSaveToHistory = () => {
    if (currentData) {
      // Create a new object to ensure it's treated as a new entry
      const entryToSave: BMIData = {
        ...currentData,
        date: new Date().toISOString() // Update the timestamp to now
      };
      onSaveToHistory(entryToSave);
    }
  };

  // Auto-calculate when any value changes
  useEffect(() => {
    handleCalculate();
  }, [age, weight, height, gender, unitSystem]);

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-gradient-to-br from-blue-50 to-slate-50">
      <CardContent className="pt-6 space-y-8">
        <div className="flex justify-between items-center p-3 bg-white/80 rounded-lg shadow-sm">
          <div className="text-sm font-medium text-blue-700">Metric Units</div>
          <Switch 
            checked={unitSystem === 'imperial'}
            onCheckedChange={handleUnitSystemChange} 
            className="data-[state=checked]:bg-blue-600"
          />
          <div className="text-sm font-medium text-blue-700">Imperial Units</div>
        </div>

        <div className="space-y-2 bg-white/80 p-4 rounded-lg shadow-sm">
          <Label htmlFor="gender" className="text-blue-800 font-medium">Gender</Label>
          <RadioGroup 
            id="gender" 
            defaultValue="male" 
            className="flex space-x-8 pt-2"
            value={gender} 
            onValueChange={(value) => setGender(value as Gender)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" className="border-blue-400 text-blue-600" />
              <Label htmlFor="male" className="cursor-pointer">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" className="border-blue-400 text-blue-600" />
              <Label htmlFor="female" className="cursor-pointer">Female</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2 bg-white/80 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <Label htmlFor="age" className="text-blue-800 font-medium">Age: {age} years</Label>
          </div>
          <div className="pt-4 px-2">
            <Slider
              id="age"
              min={10}
              max={100}
              step={1}
              value={[age]}
              onValueChange={(values) => setAge(values[0])}
              className="w-full"
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>10</span>
              <span>55</span>
              <span>100</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 bg-white/80 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <Label htmlFor="height" className="text-blue-800 font-medium">
              Height: {height} {unitSystem === 'metric' ? 'cm' : 'in'}
            </Label>
          </div>
          <div className="pt-4 px-2">
            <Slider
              id="height"
              min={getHeightRange().min}
              max={getHeightRange().max}
              step={getHeightRange().step}
              value={[height]}
              onValueChange={(values) => setHeight(values[0])}
              className="w-full"
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{getHeightRange().min}</span>
              <span>{Math.floor((getHeightRange().min + getHeightRange().max) / 2)}</span>
              <span>{getHeightRange().max}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 bg-white/80 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <Label htmlFor="weight" className="text-blue-800 font-medium">
              Weight: {weight} {unitSystem === 'metric' ? 'kg' : 'lbs'}
            </Label>
          </div>
          <div className="pt-4 px-2">
            <Slider
              id="weight"
              min={getWeightRange().min}
              max={getWeightRange().max}
              step={getWeightRange().step}
              value={[weight]}
              onValueChange={(values) => setWeight(values[0])}
              className="w-full"
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{getWeightRange().min}</span>
              <span>{Math.floor((getWeightRange().min + getWeightRange().max) / 2)}</span>
              <span>{getWeightRange().max}</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSaveToHistory} 
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2 rounded-md shadow-md transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Save className="h-5 w-5" />
          Save to History
        </Button>
      </CardContent>
    </Card>
  );
};

export default BMIForm;
