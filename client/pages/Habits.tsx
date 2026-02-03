import { Placeholder } from './Placeholder';
import { Zap } from 'lucide-react';

export default function Habits() {
  return (
    <Placeholder
      title="Habit Tracker"
      icon={<Zap size={32} />}
      description="Build and track your daily habits with streaks and progress. Request this page to continue development."
    />
  );
}
