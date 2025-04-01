import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  Bot,
  Settings as SettingsIcon,
  CreditCard,
  BarChart,
  LogOut,
  ChefHat,
  Users,
  Menu as MenuIcon,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Tag,
  FileText,
  Save,
  Upload,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { toast } from 'sonner';
import { BrickBot } from '../components/BrickBot';

// Admin Components
import { Analytics } from './Analytics';
import { Orders } from './Orders';
import { Users as UsersPanel } from './Users';
import { Settings } from './Settings';
import { Menu } from './Menu';

export function AdminPanel() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
    }
  }, [user, isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Bot className="h-8 w-8 text-brick-500" />
                <span className="ml-2 text-xl font-bold">Admin Portal</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/admin"
                  className="border-brick-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Overview
                </Link>
                <Link
                  to="/admin/orders"
                  className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Orders
                </Link>
                <Link
                  to="/admin/users"
                  className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Users
                </Link>
                <Link
                  to="/admin/menu"
                  className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Menu
                </Link>
                <Link
                  to="/admin/analytics"
                  className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Analytics
                </Link>
                <Link
                  to="/admin/settings"
                  className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Settings
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button
                  onClick={() => { supabase.auth.signOut(); navigate('/'); }}
                  className="relative inline-flex items-center gap-x-1.5 rounded-md bg-brick-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brick-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brick-500"
                >
                  <LogOut className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<UsersPanel />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeSubscriptions: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Fetch orders stats
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('status', 'confirmed');

        // Fetch active subscriptions
        const { count: subscriptionsCount } = await supabase
          .from('subscriptions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        setStats({
          totalUsers: usersCount || 0,
          totalOrders: orders?.length || 0,
          totalRevenue: orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0,
          activeSubscriptions: subscriptionsCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load overview stats');
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChefHat className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      ${stats.totalRevenue.toFixed(2)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Subscriptions</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.activeSubscriptions}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/admin/orders"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brick-500"
            >
              <div className="flex-shrink-0">
                <ChefHat className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Manage Orders</p>
                <p className="text-sm text-gray-500">View and update order status</p>
              </div>
            </Link>

            <Link
              to="/admin/menu"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brick-500"
            >
              <div className="flex-shrink-0">
                <MenuIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Edit Menu</p>
                <p className="text-sm text-gray-500">Update items and prices</p>
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brick-500"
            >
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-500">View and manage user accounts</p>
              </div>
            </Link>

            <Link
              to="/admin/analytics"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brick-500"
            >
              <div className="flex-shrink-0">
                <BarChart className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-500">Check business performance</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}