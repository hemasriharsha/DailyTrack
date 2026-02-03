import { Placeholder } from './Placeholder';
import { Calendar } from 'lucide-react';

export default function Today() {
  return (
    <Placeholder
      title="Today"
      icon={<Calendar size={32} />}
      description="This page will show a detailed view of today's activities. Request this page to continue development."
    />
  );
}
