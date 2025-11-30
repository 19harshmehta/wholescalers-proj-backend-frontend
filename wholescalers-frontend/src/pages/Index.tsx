import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, TrendingUp, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
      if (window.Cypress) return;
    if (isAuthenticated && user) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex items-center justify-between mb-16">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            WholeScaler
          </h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Streamline Your B2B
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Wholesale Operations
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect wholesalers and retailers in one powerful platform. Manage products, 
            orders, and invoices with ease.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/register')} className="gap-2">
              Start Free Trial
              <ArrowRight size={20} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-8 rounded-lg shadow-md border border-border">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Package className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Product Management
            </h3>
            <p className="text-muted-foreground">
              Wholesalers can easily create and manage their product catalog with real-time inventory tracking.
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-md border border-border">
            <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-accent" size={24} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Order Processing
            </h3>
            <p className="text-muted-foreground">
              Streamlined order workflow from placement to fulfillment with automated status updates.
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-md border border-border">
            <div className="bg-success/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-success" size={24} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Dual Portals
            </h3>
            <p className="text-muted-foreground">
              Separate dashboards for wholesalers and retailers, each with role-specific features and insights.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            © 2025 WholeScaler. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
