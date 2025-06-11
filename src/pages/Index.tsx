
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Weight, Heart, ChevronDown, History } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BMIForm from '@/components/BMIForm';
import BMIResult from '@/components/BMIResult';
import BMIHistory from '@/components/BMIHistory';
import { BMIData, getEmptyBMIData } from '@/utils/bmiCalculator';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [bmiData, setBmiData] = useState<BMIData>(getEmptyBMIData());
  const [bmiHistory, setBmiHistory] = useState<BMIData[]>([]);
  const [activeTab, setActiveTab] = useState('calculator');
  const [showResults, setShowResults] = useState(false);

  // Load BMI history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem('bmiHistory');
    if (savedHistory) {
      try {
        setBmiHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load BMI history:', error);
        localStorage.removeItem('bmiHistory');
      }
    }
  }, []);

  const handleCalculate = (data: BMIData) => {
    if (!showResults) setShowResults(true);
    setBmiData(data);
  };

  const handleSaveToHistory = (data: BMIData) => {
    // Add to history and save in localStorage
    const updatedHistory = [data, ...bmiHistory];
    setBmiHistory(updatedHistory);
    localStorage.setItem('bmiHistory', JSON.stringify(updatedHistory));
    
    // Show toast notification
    toast({
      title: "BMI Saved to History",
      description: `Your BMI of ${data.bmi.toFixed(1)} has been saved to your history.`,
    });

    // Switch to history tab after saving
    setTimeout(() => {
      setActiveTab('history');
    }, 1500);
  };

  const handleDeleteEntry = (index: number) => {
    const updatedHistory = [...bmiHistory];
    updatedHistory.splice(index, 1);
    setBmiHistory(updatedHistory);
    localStorage.setItem('bmiHistory', JSON.stringify(updatedHistory));
  };

  const handleUpdateEntryDate = (index: number, newDate: Date) => {
    const updatedHistory = [...bmiHistory];
    updatedHistory[index] = {
      ...updatedHistory[index],
      date: newDate.toISOString()
    };
    
    // Save the updated history
    setBmiHistory(updatedHistory);
    localStorage.setItem('bmiHistory', JSON.stringify(updatedHistory));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      
      <main className="flex-1 container py-6 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">BMI Calculator</h1>
            <p className="text-blue-600 max-w-lg mx-auto">
              Monitor your health with our interactive BMI calculator and track your progress over time
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-100/50 p-1 rounded-xl">
              <TabsTrigger value="calculator" className="flex gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
                <Weight className="h-4 w-4" />
                Calculator
              </TabsTrigger>
              <TabsTrigger value="history" className="flex gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="transition-all duration-300">
                  <BMIForm 
                    onCalculate={handleCalculate} 
                    onSaveToHistory={handleSaveToHistory}
                  />
                </div>
                <div className={`transition-all duration-500 transform ${showResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <BMIResult data={bmiData} />
                </div>
              </div>
              
              <div className="flex justify-center mt-10 animate-bounce">
                <ChevronDown className="text-blue-500 h-6 w-6" />
              </div>
            </TabsContent>

            <TabsContent value="history" className="animate-fade-in">
              <h2 className="text-center text-xl font-medium mb-4 text-blue-700">Your BMI Progress</h2>
              <BMIHistory 
                history={bmiHistory}
                onDeleteEntry={handleDeleteEntry}
                onUpdateEntryDate={handleUpdateEntryDate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
