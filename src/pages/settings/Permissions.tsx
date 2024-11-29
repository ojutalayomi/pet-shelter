import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface PermissionsSettingsProps {
  onSave?: (permissions: Permission[]) => void;
}

const PermissionsSettings: React.FC<PermissionsSettingsProps> = ({ onSave }) => {
  const [permissions, setPermissions] = React.useState<Permission[]>([
    {
      id: "view_pets",
      name: "View Pets",
      description: "Can view pet profiles and basic information",
      enabled: true
    },
    {
      id: "manage_pets",
      name: "Manage Pets",
      description: "Can add, edit and update pet profiles and information",
      enabled: false
    },
    {
      id: "medical_records",
      name: "Medical Records Access",
      description: "Can view and manage pet medical records and health information",
      enabled: false
    },
    {
      id: "adoption_process",
      name: "Adoption Management",
      description: "Can process adoptions and manage adoption applications",
      enabled: false
    },
    {
      id: "volunteer_management",
      name: "Volunteer Management",
      description: "Can manage volunteer schedules and assignments",
      enabled: false
    },
    {
      id: "financial_access",
      name: "Financial Access",
      description: "Can view and manage financial records and donations",
      enabled: false
    },
    {
      id: "admin_access",
      name: "Administrator Access",
      description: "Full administrative access to all shelter operations",
      enabled: false
    }
  ]);

  const handleTogglePermission = (id: string) => {
    setPermissions(permissions.map(permission => 
      permission.id === id 
        ? { ...permission, enabled: !permission.enabled }
        : permission
    ));
  };

  const handleSave = () => {
    onSave?.(permissions);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Permissions Settings</CardTitle>
          <p className="text-sm text-gray-500">
            Manage staff and volunteer access permissions for the pet shelter system
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={permission.id}>{permission.name}</Label>
                  <p className="text-sm text-muted-foreground">
                    {permission.description}
                  </p>
                </div>
                <Switch
                  id={permission.id}
                  checked={permission.enabled}
                  onCheckedChange={() => handleTogglePermission(permission.id)}
                />
              </div>
            ))}
            
            <Separator className="my-4" />
            
            <div className="flex justify-end">
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsSettings;
