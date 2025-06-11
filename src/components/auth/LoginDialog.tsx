
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import LoginForm from './LoginForm';

interface LoginDialogProps {
  onLoginSuccess?: () => void;
}

const LoginDialog = ({ onLoginSuccess }: LoginDialogProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">Log In</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Welcome Back</DialogTitle>
        </DialogHeader>
        <LoginForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account? Create one to save your BMI history.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
