import { Placeholder } from './Placeholder';
import { Archive } from 'lucide-react';

export default function ArchivePage() {
  return (
    <Placeholder
      title="Archive"
      icon={<Archive size={32} />}
      description="View and restore archived goals and notes from previous days. Request this page to continue development."
    />
  );
}
