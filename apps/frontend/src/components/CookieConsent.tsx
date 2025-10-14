'use client';

import React, { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CONSENT_KEY = 'cookie_consent';
const PREFERENCES_KEY = 'cookie_preferences';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    } else {
      // Load saved preferences
      const savedPrefs = localStorage.getItem(PREFERENCES_KEY);
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        setPreferences(prefs);
        applyPreferences(prefs);
      }
    }
  }, []);

  const applyPreferences = (prefs: CookiePreferences) => {
    // Initialize analytics if allowed
    if (prefs.analytics && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      analytics.init(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
    }

    // Additional cookie management based on preferences
    if (!prefs.analytics) {
      // Disable analytics cookies
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (name.startsWith('_ga') || name.startsWith('_gid')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
    }
  };

  const handleAcceptAll = () => {
    const newPrefs = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(newPrefs);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const newPrefs = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(newPrefs);
    setShowBanner(false);
  };

  const handleSaveSettings = () => {
    savePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(CONSENT_KEY, 'true');
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    applyPreferences(prefs);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {!showSettings ? (
            // Simple consent banner
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🍪 We use cookies
                </h3>
                <p className="text-sm text-gray-600">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <a href="/privacy-policy" className="text-blue-600 hover:underline">
                    Read our Privacy Policy
                  </a>
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cookie Settings
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            // Detailed settings
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close settings"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">Necessary Cookies</h4>
                      <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">Required</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Essential for the website to function. Cannot be disabled.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded cursor-not-allowed opacity-50"
                  />
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={() => togglePreference('analytics')}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded cursor-pointer"
                  />
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Used to track visitors across websites for advertising purposes.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={() => togglePreference('marketing')}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Save Preferences
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Hook to access cookie preferences
 */
export function useCookiePreferences() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(PREFERENCES_KEY);
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  return preferences;
}

export default CookieConsent;

