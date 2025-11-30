import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Package, ShoppingCart, FileText, Menu, X, BarChart3 } from 'lucide-react';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isWholesaler = user?.role === 'wholesaler';

  const menuItems = isWholesaler
    ? [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/wholesaler/dashboard' },
        { icon: Package, label: 'Products', path: '/wholesaler/products' },
        { icon: ShoppingCart, label: 'Orders', path: '/wholesaler/orders' },
        { icon: FileText, label: 'Invoices', path: '/wholesaler/invoices' },
        { icon: BarChart3, label: 'Reports', path: '/wholesaler/reports' },
      ]
    : [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/retailer/dashboard' },
        { icon: Package, label: 'Products', path: '/retailer/products' },
        { icon: ShoppingCart, label: 'Orders', path: '/retailer/orders' },
        { icon: FileText, label: 'Invoices', path: '/retailer/invoices' },
      ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-sidebar-foreground">WholeScaler</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          {sidebarOpen && (
            <div className="mb-3 px-2">
              <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/70">{user?.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={logout}
            className={`w-full ${
              sidebarOpen ? 'justify-start' : 'justify-center'
            } text-sidebar-foreground hover:bg-sidebar-accent`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-card border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {isWholesaler ? 'Wholesaler Portal' : 'Retailer Portal'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.company}</span>
            </div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};
