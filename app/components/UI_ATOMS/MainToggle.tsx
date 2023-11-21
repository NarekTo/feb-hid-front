"use client"
import { FC } from 'react';
import { Switch } from '@headlessui/react';

interface MainToggleProps {
  showAll: boolean;
  setShowAll: (showAll: boolean) => void;
}

 const MainToggle: FC<MainToggleProps> = ({ showAll, setShowAll }) => {
  return (
    <div className="flex items-center mx-2">
      <Switch
        checked={showAll}
        onChange={() => setShowAll(!showAll)}
        className={`${
          showAll ? 'bg-primary-button' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span className="sr-only">Enable notifications</span>
        <span
          className={`${
            showAll ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
      <span className="mx-2 ">{showAll ? "All Projects" : "Active Projects"}</span>
    </div>
  );
};

export default MainToggle;