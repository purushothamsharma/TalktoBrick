import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { 
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  ShoppingBag,
  Clock,
  Filter,
  RefreshCw,
  Download
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { OrderStats, UserStats, RevenueStats } from '../types';

const COLORS = ['#2B2B2B', '#D4AF37', '#8B2E2E', '#C6A664'];

export function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    daily: 0,
    weekly: 0,
    monthly: 0,
    averageOrderValue: 0
  });
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    active: 0,
    newThisMonth: 0,
    churnRate: 0
  });
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearToDate: 0
  });
  const [orderTrends, setOrderTrends] = useState<any[]>([]);
  const [revenueTrends, setRevenueTrends] = useState<any[]>([]);
  const [popularItems, setPopularItems] = useState<any[]>([]);
  const [peakHours, setPeakHours] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90);

      // Fetch orders within date range
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .eq('status', 'confirmed');

      if (ordersError) throw ordersError;

      // Calculate order stats
      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      
      setOrderStats({
        daily: totalOrders / (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90),
        weekly: (totalOrders / (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90)) * 7,
        monthly: (totalOrders / (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90)) * 30,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
      });

      // Calculate revenue stats
      setRevenueStats({
        daily: totalRevenue / (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90),
        weekly: (totalRevenue / (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90)) * 7,
        monthly: (totalRevenue / (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90)) * 30,
        yearToDate: totalRevenue
      });

      // Generate trends data
      const trends = orders?.reduce((acc: any, order) => {
        const date = format(new Date(order.created_at), 'MMM dd');
        if (!acc[date]) {
          acc[date] = { date, orders: 0, revenue: 0 };
        }
        acc[date].orders++;
        acc[date].revenue += order.total_amount;
        return acc;
      }, {});

      setOrderTrends(Object.values(trends || {}));
      setRevenueTrends(Object.values(trends || {}));

      // Calculate popular items
      const itemCounts = orders?.reduce((acc: any, order) => {
        order.items.forEach((item: any) => {
          if (!acc[item.item.name]) {
            acc[item.item.name] = { name: item.item.name, value: 0 };
          }
          acc[item.item.name].value += item.quantity;
        });
        return acc;
      }, {});

      setPopularItems(Object.values(itemCounts || {}).sort((a: any, b: any) => b.value - a.value).slice(0, 5));

      // Calculate peak hours
      const hourCounts = orders?.reduce((acc: any, order) => {
        const hour = new Date(order.created_at).getHours();
        if (!acc[hour]) {
          acc[hour] = { hour, orders: 0 };
        }
        acc[hour].orders++;
        return acc;
      }, {});

      setPeakHours(Object.values(hourCounts || {}).sort((a: any, b: any) => b.orders - a.orders));

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string | number; trend?: string }) => (
    <div className="bg-white rounded-xl shadow-luxury p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-brick-500/10 rounded-lg text-brick-500">
          {icon}
        </div>
        <div>
          <p className="text-sm text-brick-950/70">{label}</p>
          <p className="text-2xl font-bold text-brick-950">{value}</p>
          {trend && (
            <p className="text-sm text-green-600">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              {trend}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brick-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brick-950">Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border-surface-200 text-sm focus:ring-brick-500 focus:border-brick-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="p-2 text-brick-950/60 hover:text-brick-950 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="p-2 text-brick-950/60 hover:text-brick-950 transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<ShoppingBag className="w-6 h-6" />}
          label="Daily Orders"
          value={orderStats.daily.toFixed(1)}
          trend="+12.5% vs last week"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Average Order Value"
          value={`$${orderStats.averageOrderValue.toFixed(2)}`}
          trend="+5.2% vs last week"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Active Users"
          value={userStats.active}
          trend="+8.1% vs last month"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          label="Monthly Revenue"
          value={`$${revenueStats.monthly.toFixed(2)}`}
          trend="+15.3% vs last month"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Trends */}
        <div className="bg-white rounded-xl shadow-luxury p-6">
          <h2 className="text-lg font-bold text-brick-950 mb-6">Order Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#2B2B2B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trends */}
        <div className="bg-white rounded-xl shadow-luxury p-6">
          <h2 className="text-lg font-bold text-brick-950 mb-6">Revenue Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#D4AF37" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-xl shadow-luxury p-6">
          <h2 className="text-lg font-bold text-brick-950 mb-6">Popular Items</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={popularItems}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {popularItems.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-xl shadow-luxury p-6">
          <h2 className="text-lg font-bold text-brick-950 mb-6">Peak Hours</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#8B2E2E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}