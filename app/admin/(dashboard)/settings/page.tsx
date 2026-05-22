"use client";

import { useEffect, useState, useCallback } from "react";
import { adminApi } from "@/lib/api/admin";
import { Button, Input, FormErrorAlert } from "@/components/ui";
import { getApiErrorDetails, showApiErrorToast, type ParsedApiError } from "@/lib/errors/apiError";

const SETTING_FIELDS = [
  { key: "company_name", label: "Company Name", placeholder: "Meenarh Logistics" },
  { key: "tagline", label: "Tagline", placeholder: "Fast, trackable deliveries across Lagos." },
  { key: "phone", label: "Phone Number", placeholder: "08012345678" },
  { key: "email", label: "Email Address", placeholder: "info@meenarh.com" },
  { key: "address", label: "Office Address", placeholder: "Lagos, Nigeria" },
  { key: "whatsapp", label: "WhatsApp Number", placeholder: "2348012345678" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorDetails, setErrorDetails] = useState<ParsedApiError | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await adminApi.getSettings();
      setSettings(res.data || {});
    } catch (err) {
      const details = getApiErrorDetails(err, "Failed to load settings");
      setErrorDetails(details);
      showApiErrorToast(err, "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSuccess("");
    setErrorDetails(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorDetails(null);
    setSuccess("");
    try {
      await adminApi.updateSettings(settings);
      setSuccess("Settings saved successfully");
    } catch (err) {
      const details = getApiErrorDetails(err, "Failed to save settings");
      setErrorDetails(details);
      showApiErrorToast(err, "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Company Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your company contact details and information</p>
      </div>

      <FormErrorAlert
        message={errorDetails?.message}
        items={errorDetails?.items}
      />
      {success && (
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm">
          {success}
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
        {SETTING_FIELDS.map((field) => (
          <Input
            key={field.key}
            label={field.label}
            value={settings[field.key] || ""}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            id={`setting-${field.key}`}
          />
        ))}

        <div className="pt-4">
          <Button variant="primary" onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
