import { Placeholder } from './Placeholder';
import { CheckSquare } from 'lucide-react';

export default function Goals() {
  return (
    <Placeholder
      title="Daily Goals"
      icon={<CheckSquare size={32} />}
      description="Manage and track all your goals across different categories. Request this page to continue development."
    />
  );
}
