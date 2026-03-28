import React, { useState } from 'react';
import { saveConfig, missingKeys } from '../lib/firebase';
import { Settings, AlertTriangle, Save } from 'lucide-react';

export default function FirebaseConfig() {
  const [config, setConfig] = useState({
    VITE_FIREBASE_API_KEY: '',
    VITE_FIREBASE_AUTH_DOMAIN: '',
    VITE_FIREBASE_PROJECT_ID: '',
    VITE_FIREBASE_STORAGE_BUCKET: '',
    VITE_FIREBASE_MESSAGING_SENDER_ID: '',
    VITE_FIREBASE_APP_ID: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig(config);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">App Configuration</h2>
              <p className="text-slate-500">Firebase setup required to continue.</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Missing Environment Variables</p>
              <p>
                The following keys are missing from your configuration:
                <span className="font-mono ml-1 bg-amber-100 px-1 rounded">
                  {missingKeys.join(', ')}
                </span>
              </p>
              <p className="mt-2 text-amber-700">
                Please enter your Firebase configuration details below. These will be saved locally in your browser.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(config).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    {key.replace('VITE_FIREBASE_', '').replace(/_/g, ' ')}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={config[key as keyof typeof config]}
                    onChange={handleChange}
                    placeholder={`Enter ${key}...`}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-mono text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-6">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Configuration & Reload
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <a 
              href="https://console.firebase.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-emerald-600 hover:underline"
            >
              Open Firebase Console &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
