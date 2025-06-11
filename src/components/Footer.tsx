
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-4 px-4 md:px-8 text-center text-sm text-muted-foreground mt-auto">
      <p>© {new Date().getFullYear()} BMI Calculator. Based on WHO classifications.</p>
      <p className="mt-1">This calculator is for informational purposes only.</p>
    </footer>
  );
};

export default Footer;
