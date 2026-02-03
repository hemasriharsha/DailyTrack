import { Placeholder } from './Placeholder';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <Placeholder
      title="Settings"
      icon={<Settings size={32} />}
      description="Customize your DailyTrack experience with preferences and account settings. Request this page to continue development."
    />
  );
}
