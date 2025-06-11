
export type Gender = 'male' | 'female';
export type UnitSystem = 'metric' | 'imperial';
export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obesity' | 'unknown';

export interface BMIData {
  bmi: number;
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  category: BMICategory;
  idealWeightRange: { min: number; max: number };
  date: string;
  unitSystem: UnitSystem;
}

export function calculateBMI(
  weight: number,
  height: number,
  unitSystem: UnitSystem
): number {
  if (height <= 0 || weight <= 0) return 0;

  let bmi: number;
  
  if (unitSystem === 'metric') {
    // Weight in kg, height in cm
    bmi = weight / ((height / 100) * (height / 100));
  } else {
    // Weight in lbs, height in inches
    bmi = (weight * 703) / (height * height);
  }
  
  return parseFloat(bmi.toFixed(1));
}

export function getBMICategory(bmi: number): BMICategory {
  if (bmi <= 0) return 'unknown';
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obesity';
}

export function calculateIdealWeight(
  height: number,
  gender: Gender,
  unitSystem: UnitSystem
): { min: number; max: number } {
  if (height <= 0) return { min: 0, max: 0 };

  let minWeight: number;
  let maxWeight: number;

  if (unitSystem === 'metric') {
    // Height in cm
    const heightInM = height / 100;
    minWeight = 18.5 * heightInM * heightInM;
    maxWeight = 24.9 * heightInM * heightInM;
  } else {
    // Height in inches
    minWeight = (18.5 * height * height) / 703;
    maxWeight = (24.9 * height * height) / 703;
  }

  // Adjust slightly based on gender
  if (gender === 'female') {
    minWeight = minWeight * 0.9;
    maxWeight = maxWeight * 0.9;
  }

  return {
    min: parseFloat(minWeight.toFixed(1)),
    max: parseFloat(maxWeight.toFixed(1)),
  };
}

export function getHealthTips(category: BMICategory): string {
  switch (category) {
    case 'underweight':
      return 'Consider consulting with a dietitian for a personalized nutrition plan to help you gain weight in a healthy way.';
    case 'normal':
      return 'Great job! Maintain your healthy habits with regular exercise and balanced nutrition.';
    case 'overweight':
      return 'Focus on a balanced diet with portion control and try to incorporate 150 minutes of moderate exercise weekly.';
    case 'obesity':
      return 'Consider consulting with a healthcare professional for a personalized plan to achieve and maintain a healthy weight.';
    default:
      return 'Enter your information to receive personalized health tips.';
  }
}

export function getCategoryColor(category: BMICategory): string {
  switch (category) {
    case 'underweight':
      return 'warning';
    case 'normal':
      return 'success';
    case 'overweight':
      return 'warning';
    case 'obesity':
      return 'danger';
    default:
      return 'primary';
  }
}

export function formatWeight(weight: number, unitSystem: UnitSystem): string {
  return `${weight} ${unitSystem === 'metric' ? 'kg' : 'lbs'}`;
}

export function formatHeight(height: number, unitSystem: UnitSystem): string {
  if (unitSystem === 'metric') {
    return `${height} cm`;
  } else {
    const feet = Math.floor(height / 12);
    const inches = height % 12;
    return `${feet}'${inches}"`;
  }
}

export function convertHeight(height: number, from: UnitSystem, to: UnitSystem): number {
  if (from === to) return height;
  
  if (from === 'metric' && to === 'imperial') {
    // cm to inches
    return parseFloat((height / 2.54).toFixed(1));
  } else {
    // inches to cm
    return parseFloat((height * 2.54).toFixed(1));
  }
}

export function convertWeight(weight: number, from: UnitSystem, to: UnitSystem): number {
  if (from === to) return weight;
  
  if (from === 'metric' && to === 'imperial') {
    // kg to lbs
    return parseFloat((weight * 2.20462).toFixed(1));
  } else {
    // lbs to kg
    return parseFloat((weight / 2.20462).toFixed(1));
  }
}

export function getEmptyBMIData(): BMIData {
  return {
    bmi: 0,
    weight: 0,
    height: 0,
    age: 0,
    gender: 'male',
    category: 'unknown',
    idealWeightRange: { min: 0, max: 0 },
    date: new Date().toISOString(),
    unitSystem: 'metric',
  };
}
