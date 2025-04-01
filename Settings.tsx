import React, { useState, useEffect } from 'react';
import { 
  Save,
  Upload,
  Globe,
  Clock,
  Brain,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface BusinessSettings {
  name: string;
  description: string;
  logo_url: string | null;
  operating_hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  ai_features: {
    autoUpsell: boolean;
    allergyWarnings: boolean;
    dietaryRecommendations: boolean;
    smartPairing: boolean;
  };
}

export function Settings() {
  const [settings, setSettings] = useState<BusinessSettings>({
    name: '',
    description: '',
    logo_url: null,
    operating_hours: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '10:00', close: '22:00' }
    },
    ai_features: {
      autoUpsell: true,
      allergyWarnings: true,
      dietaryRecommendations: true,
      smartPairing: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, create default
          const { error: insertError } = await supabase
            .from('business_settings')
            .insert({
              user_id: user.id,
              ...settings
            });
          if (insertError) throw insertError;
        } else {
          throw error;
        }
      } else if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('business_settings')
        .upsert({
          user_id: user.id,
          ...settings
        });

      if (error) throw error;
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-logo.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('business-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('business-logos')
        .getPublicUrl(fileName);

      setSettings(prev => ({ ...prev, logo_url: publicUrl }));
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brick-500 mx-auto"></div>
        <p className="mt-4 text-brick-950/60">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white shadow-luxury rounded-lg p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brick-950">Business Settings</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`btn-primary flex items-center gap-2 ${
            saving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-brick-950">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-brick-950">Business Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-surface-200 shadow-sm focus:border-brick-500 focus:ring-2 focus:ring-brick-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brick-950">Description</label>
            <textarea
              value={settings.description}
              onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-lg border-surface-200 shadow-sm focus:border-brick-500 focus:ring-2 focus:ring-brick-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brick-950">Logo</label>
            <div className="mt-1 flex items-center gap-4">
              {settings.logo_url && (
                <img
                  src={settings.logo_url}
                  alt="Business Logo"
                  className="h-12 w-12 object-contain rounded-lg"
                />
              )}
              <label className="btn-outline flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload Logo
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-brick-950">Operating Hours</h3>
          <div className="grid gap-4">
            {days.map((day) => (
              <div key={day} className="grid grid-cols-3 gap-4 items-center">
                <span className="text-sm font-medium text-brick-950 capitalize">{day}</span>
                <div>
                  <label className="sr-only">Opening Time</label>
                  <input
                    type="time"
                    value={settings.operating_hours[day].open}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      operating_hours: {
                        ...prev.operating_hours,
                        [day]: { ...prev.operating_hours[day], open: e.target.value }
                      }
                    }))}
                    className="block w-full rounded-lg border-surface-200 shadow-sm focus:border-brick-500 focus:ring-2 focus:ring-brick-500/20"
                  />
                </div>
                <div>
                  <label className="sr-only">Closing Time</label>
                  <input
                    type="time"
                    value={settings.operating_hours[day].close}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      operating_hours: {
                        ...prev.operating_hours,
                        [day]: { ...prev.operating_hours[day], close: e.target.value }
                      }
                    }))}
                    className="block w-full rounded-lg border-surface-200 shadow-sm focus:border-brick-500 focus:ring-2 focus:ring-brick-500/20"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-brick-950">AI Features</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-brick-950">Auto Upsell</h4>
                <p className="text-sm text-brick-950/60">Automatically suggest complementary items</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  ai_features: { ...prev.ai_features, autoUpsell: !prev.ai_features.autoUpsell }
                }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brick-500 focus:ring-offset-2 ${
                  settings.ai_features.autoUpsell ? 'bg-brick-500' : 'bg-surface-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.ai_features.autoUpsell ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-brick-950">Allergy Warnings</h4>
                <p className="text-sm text-brick-950/60">Proactively warn about allergens</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  ai_features: { ...prev.ai_features, allergyWarnings: !prev.ai_features.allergyWarnings }
                }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brick-500 focus:ring-offset-2 ${
                  settings.ai_features.allergyWarnings ? 'bg-brick-500' : 'bg-surface-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.ai_features.allergyWarnings ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-brick-950">Dietary Recommendations</h4>
                <p className="text-sm text-brick-950/60">Suggest items based on dietary preferences</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  ai_features: { ...prev.ai_features, dietaryRecommendations: !prev.ai_features.dietaryRecommendations }
                }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brick-500 focus:ring-offset-2 ${
                  settings.ai_features.dietaryRecommendations ? 'bg-brick-500' : 'bg-surface-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.ai_features.dietaryRecommendations ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-brick-950">Smart Pairing</h4>
                <p className="text-sm text-brick-950/60">Intelligent wine and side dish recommendations</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  ai_features: { ...prev.ai_features, smartPairing: !prev.ai_features.smartPairing }
                }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brick-500 focus:ring-offset-2 ${
                  settings.ai_features.smartPairing ? 'bg-brick-500' : 'bg-surface-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.ai_features.smartPairing ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}