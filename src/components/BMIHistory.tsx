
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { BMIData, getCategoryColor } from '@/utils/bmiCalculator';
import { Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

interface BMIHistoryProps {
  history: BMIData[];
  onDeleteEntry?: (index: number) => void;
  onUpdateEntryDate?: (index: number, newDate: Date) => void;
}

const BMIHistory: React.FC<BMIHistoryProps> = ({ 
  history, 
  onDeleteEntry,
  onUpdateEntryDate 
}) => {
  const [selectedEntryForDelete, setSelectedEntryForDelete] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!history.length) {
    return (
      <Card className="w-full text-center p-8">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No BMI records yet. Save your BMI results to track your progress!</p>
        </CardContent>
      </Card>
    );
  }

  // Sort history by date (ascending order - earliest to latest)
  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Format data for chart - use the sorted history and reverse for display
  const chartData = sortedHistory.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    bmi: entry.bmi,
    category: entry.category,
  }));

  // Calculate statistics
  const latestBmi = history.length > 0 ? history[0].bmi : 0;
  const firstBmi = sortedHistory.length > 0 ? sortedHistory[0].bmi : 0;
  const bmiChange = latestBmi - firstBmi;
  
  // Find min and max BMI values
  const minBmi = Math.min(...history.map(entry => entry.bmi));
  const maxBmi = Math.max(...history.map(entry => entry.bmi));

  const handleDelete = (index: number) => {
    setSelectedEntryForDelete(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEntryForDelete !== null && onDeleteEntry) {
      onDeleteEntry(selectedEntryForDelete);
      toast({
        title: "Entry Deleted",
        description: "The BMI record has been removed from your history.",
      });
    }
    setDeleteDialogOpen(false);
    setSelectedEntryForDelete(null);
  };

  const handleDateChange = (index: number, date: Date) => {
    if (onUpdateEntryDate) {
      onUpdateEntryDate(index, date);
      toast({
        title: "Date Updated",
        description: "The date for this BMI record has been updated.",
      });
    }
  };

  // Get the most recent entries for display in the table (latest first)
  const recentEntries = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 10);

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle>BMI Progress Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 10,
                  left: 5,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  domain={[Math.max(minBmi - 2, 15), Math.min(maxBmi + 2, 40)]} 
                  tick={{ fontSize: 12 }} 
                />
                <Tooltip
                  contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                  formatter={(value) => [`BMI: ${value}`, 'Value']}
                />
                
                {/* Reference lines for BMI categories */}
                <ReferenceLine y={18.5} stroke="#FFB700" strokeDasharray="3 3" label={{ value: 'Underweight', position: 'insideLeft', fontSize: 10 }} />
                <ReferenceLine y={25} stroke="#FFB700" strokeDasharray="3 3" label={{ value: 'Overweight', position: 'insideLeft', fontSize: 10 }} />
                <ReferenceLine y={30} stroke="#FF4500" strokeDasharray="3 3" label={{ value: 'Obesity', position: 'insideLeft', fontSize: 10 }} />
                
                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4, fill: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-4 justify-around mt-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">First BMI</div>
              <div className="text-xl font-semibold">{firstBmi.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Latest BMI</div>
              <div className="text-xl font-semibold">{latestBmi.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Change</div>
              <div className={`text-xl font-semibold ${bmiChange === 0 ? 'text-blue-500' : bmiChange < 0 ? 'text-green-500' : 'text-amber-500'}`}>
                {bmiChange > 0 ? '+' : ''}{bmiChange.toFixed(1)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="pb-0">
          <CardTitle>BMI History Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>BMI</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEntries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(new Date(entry.date), 'PPP')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(entry.date)}
                          onSelect={(date) => date && handleDateChange(index, date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell className="font-medium">{entry.bmi.toFixed(1)}</TableCell>
                  <TableCell>{entry.weight} {entry.unitSystem === 'metric' ? 'kg' : 'lbs'}</TableCell>
                  <TableCell>
                    <Badge className={`bg-${getCategoryColor(entry.category)}`}>
                      {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {history.length > 10 && (
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Showing latest 10 of {history.length} entries
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this BMI record from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BMIHistory;
