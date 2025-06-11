
import React from 'react';
import { Heart, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginDialog from './auth/LoginDialog';
import SignUpDialog from './auth/SignUpDialog';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground py-4 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Heart className="h-6 w-6" />
        <h1 className="text-xl font-bold">BMI Calculator</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-sm font-medium mr-4">
          WHO Classification
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div className="mr-2 text-sm hidden md:block">
              Hello, <span className="font-medium">{user?.name}</span>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Log Out</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <LoginDialog />
            <SignUpDialog />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
