import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface NotificationSettingsProps {
  onSave?: (settings: NotificationSetting[]) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onSave }) => {
  const [settings, setSettings] = React.useState<NotificationSetting[]>([
    {
      id: "new_pets",
      name: "New Pet Alerts",
      description: "Get notified when new pets are added to the shelter",
      enabled: true
    },
    {
      id: "adoption_updates",
      name: "Adoption Updates",
      description: "Receive updates on pet adoption status changes",
      enabled: true
    },
    {
      id: "medical_reminders",
      name: "Medical Reminders",
      description: "Get reminders for pet vaccinations and medical checkups",
      enabled: true
    },
    {
      id: "foster_requests",
      name: "Foster Requests",
      description: "Notifications for new foster care requests and updates",
      enabled: false
    },
    {
      id: "volunteer_schedules",
      name: "Volunteer Schedules",
      description: "Updates about volunteer shift schedules and changes",
      enabled: false
    },
    {
      id: "donation_alerts",
      name: "Donation Alerts",
      description: "Get notified about new donations and fundraising events",
      enabled: false
    },
    {
      id: "emergency_alerts",
      name: "Emergency Alerts",
      description: "Critical notifications about shelter emergencies",
      enabled: true
    }
  ]);

  const handleToggleSetting = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id 
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ));
  };

  const handleSave = () => {
    onSave?.(settings);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <p className="text-sm text-gray-500">
            Manage your notification preferences for the pet shelter system
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={setting.id}>{setting.name}</Label>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <Switch
                  id={setting.id}
                  checked={setting.enabled}
                  onCheckedChange={() => handleToggleSetting(setting.id)}
                />
              </div>
            ))}
            
            <Separator className="my-4" />
            
            <div className="flex justify-end">
              <Button onClick={handleSave}>
                Save Preferences
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
