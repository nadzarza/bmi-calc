
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import SignUpForm from './SignUpForm';

interface SignUpDialogProps {
  onSignUpSuccess?: () => void;
}

const SignUpDialog = ({ onSignUpSuccess }: SignUpDialogProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSignUpSuccess) onSignUpSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white/10 border-white/20 flex items-center gap-1"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Up</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Create an Account</DialogTitle>
        </DialogHeader>
        <SignUpForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
        <p className="text-center text-sm text-muted-foreground mt-4">
          By signing up, you can save your BMI history and track your progress.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
