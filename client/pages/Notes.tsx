import { Placeholder } from './Placeholder';
import { BookOpen } from 'lucide-react';

export default function Notes() {
  return (
    <Placeholder
      title="Notes"
      icon={<BookOpen size={32} />}
      description="A rich text editor for all your notes and reflections. Request this page to continue development."
    />
  );
}
