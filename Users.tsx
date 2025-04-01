import React, { useState, useEffect } from 'react';
import { 
  Search,
  Filter,
  RefreshCw,
  Mail,
  Calendar,
  Star,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '../types';

type UserStatus = 'active' | 'suspended' | 'pending';
type UserRole = 'user' | 'admin';
type SortField = 'created_at' | 'email' | 'role' | 'status';
type SortOrder = 'asc' | 'desc';

export function Users() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, roleFilter, sortField, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: { users }, error } = await supabase.auth.admin.listUsers();

      if (error) throw error;

      const userProfiles: UserProfile[] = users.map(user => ({
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name,
        role: user.user_metadata?.role || 'user',
        subscription: user.user_metadata?.subscription,
        preferences: user.user_metadata?.preferences
      }));

      // Apply filters
      let filteredUsers = userProfiles;
      
      if (searchQuery) {
        filteredUsers = filteredUsers.filter(user => 
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (statusFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => 
          user.subscription?.status === statusFilter
        );
      }

      if (roleFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => 
          user.role === roleFilter
        );
      }

      // Apply sorting
      filteredUsers.sort((a, b) => {
        if (sortField === 'email') {
          return sortOrder === 'asc' 
            ? a.email.localeCompare(b.email)
            : b.email.localeCompare(a.email);
        }
        if (sortField === 'role') {
          return sortOrder === 'asc'
            ? a.role.localeCompare(b.role)
            : b.role.localeCompare(a.role);
        }
        // Default to created_at
        return sortOrder === 'asc' 
          ? (new Date(a.subscription?.currentPeriodEnd || 0)).getTime() - (new Date(b.subscription?.currentPeriodEnd || 0)).getTime()
          : (new Date(b.subscription?.currentPeriodEnd || 0)).getTime() - (new Date(a.subscription?.currentPeriodEnd || 0)).getTime();
      });

      setUsers(filteredUsers);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<UserProfile>) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: updates
      });

      if (error) throw error;

      toast.success('User updated successfully');
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-brick-500 text-white';
      default:
        return 'bg-surface-100 text-brick-950';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
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
        <h2 className="text-2xl font-bold text-brick-950">User Management</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brick-950/40" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-surface-200 focus:ring-2 focus:ring-brick-500/20 focus:border-brick-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-brick-950/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
              className="rounded-lg border-surface-200 text-sm focus:ring-brick-500 focus:border-brick-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
              className="rounded-lg border-surface-200 text-sm focus:ring-brick-500 focus:border-brick-500"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            onClick={fetchUsers}
            className="p-2 text-brick-950/60 hover:text-brick-950 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* User List */}
      <div className="bg-white rounded-xl shadow-luxury overflow-hidden">
        <table className="min-w-full divide-y divide-surface-200">
          <thead className="bg-surface-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brick-950/70 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brick-950/70 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brick-950/70 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brick-950/70 uppercase tracking-wider">
                Subscription
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brick-950/70 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-surface-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-surface-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-brick-500/10 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-brick-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-brick-950">
                        {user.name || 'Unnamed User'}
                      </div>
                      <div className="text-sm text-brick-950/70">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.subscription?.status || 'pending')}`}>
                    {user.subscription?.status || 'pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brick-950/70">
                  {user.subscription?.plan || 'No subscription'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditModalOpen(true);
                      }}
                      className="text-brick-950/60 hover:text-brick-950 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}