import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageSquare,
  BarChart,
  Users,
  Clock,
  DollarSign,
  LogOut,
  ChefHat,
  Menu as MenuIcon,
  Settings as SettingsIcon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '../lib/auth';
import { BrickBot } from './BrickBot';

const QUICK_ACTIONS = [
  {
    title: 'View Orders',
    icon: <MessageSquare className="w-6 h-6" />,
    description: 'Check and manage incoming orders',
    link: '/admin'
  },
  {
    title: 'Menu Management',
    icon: <ChefHat className="w-6 h-6" />,
    description: 'Update your menu and prices',
    link: '/dashboard/menu'
  },
  {
    title: 'Business Settings',
    icon: <SettingsIcon className="w-6 h-6" />,
    description: 'Configure your restaurant settings',
    link: '/dashboard/settings'
  },
  {
    title: 'Analytics',
    icon: <BarChart className="w-6 h-6" />,
    description: 'View sales and performance metrics',
    link: '/dashboard/analytics'
  }
];

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [stats, setStats] = React.useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });

  React.useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      try {
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'confirmed');

        if (error) throw error;

        const totalOrders = orders?.length || 0;
        const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

        setStats({
          totalOrders,
          totalRevenue,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load dashboard stats');
      }
    };

    fetchStats();
  }, [user?.id]);

  const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
    <div className="bg-white rounded-xl shadow-luxury p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-brick-500/10 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm text-brick-950/70">{label}</p>
          <p className="text-2xl font-bold text-brick-950">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <BrickBot size="sm" expression="happy" />
              <span className="ml-2 text-xl font-bold">Brick Dashboard</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => { supabase.auth.signOut(); navigate('/'); }}
                className="flex items-center text-brick-950/60 hover:text-brick-600 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-brick-950 hover:text-brick-600"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-surface-200">
            <div className="px-2 pt-2 pb-3">
              <button
                onClick={() => { supabase.auth.signOut(); navigate('/'); }}
                className="block w-full text-left px-3 py-2 text-brick-950/60 hover:text-brick-600"
              >
                <LogOut className="w-5 h-5 inline mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-brick-950">
              Welcome back, {user?.user_metadata?.name || 'there'}!
            </h1>
            <p className="text-brick-950/70">
              Here's an overview of your business performance
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={<MessageSquare className="w-6 h-6 text-brick-500" />}
              label="Total Orders"
              value={stats.totalOrders}
            />
            <StatCard 
              icon={<DollarSign className="w-6 h-6 text-brick-500" />}
              label="Total Revenue"
              value={`$${stats.totalRevenue.toFixed(2)}`}
            />
            <StatCard 
              icon={<Clock className="w-6 h-6 text-brick-500" />}
              label="Avg. Order Value"
              value={`$${stats.averageOrderValue.toFixed(2)}`}
            />
            <StatCard 
              icon={<Users className="w-6 h-6 text-brick-500" />}
              label="Active Users"
              value="--"
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-brick-950 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.title}
                  to={action.link}
                  className="bg-white rounded-xl shadow-luxury p-6 hover:shadow-luxury-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-brick-500/10 rounded-lg">
                      {action.icon}
                    </div>
                    <h3 className="font-semibold text-brick-950">{action.title}</h3>
                  </div>
                  <p className="text-sm text-brick-950/70">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}