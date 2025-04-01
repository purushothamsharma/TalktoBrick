import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { 
  Users,
  Activity,
  Settings as SettingsIcon,
  CreditCard,
  Bot
} from 'lucide-react';

// Rename AdminSettings to PortalSettings to avoid conflicts
function PortalSettings() {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Admin Settings</h3>
        {/* Add admin settings content */}
      </div>
    </div>
  );
}

export function AdminPortal() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Bot className="h-8 w-8 text-purple-600" />
                <span className="ml-2 text-xl font-bold">ViLa Labs Admin</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/admin"
                  className="border-purple-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Overview
                </Link>
                <Link
                  to="/admin/clients"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Clients
                </Link>
                <Link
                  to="/admin/usage"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Usage
                </Link>
                <Link
                  to="/admin/settings"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/clients" element={<ClientList />} />
              <Route path="/usage" element={<UsageStats />} />
              <Route path="/settings" element={<PortalSettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminOverview() {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          ViLa Labs Admin Overview
        </h3>
        {/* Add overview content */}
      </div>
    </div>
  );
}

function ClientList() {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Clients</h3>
        {/* Add client list content */}
      </div>
    </div>
  );
}

function UsageStats() {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Usage Statistics</h3>
        {/* Add usage stats content */}
      </div>
    </div>
  );
}