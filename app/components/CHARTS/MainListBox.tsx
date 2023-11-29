import { TiArrowUnsorted } from "react-icons/ti";
import { TbCheck } from "react-icons/tb";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

interface MainListBoxProps {
  list: any[]; // Replace 'any' with the actual type of the items in the list
  displayKey: string;
  setSelectedProject: (value: any) => void; // Replace 'any' with the actual type of the value
  selected: any; // Replace 'any' with the actual type of the selected item
}

export const MainListBox: React.FC<MainListBoxProps> = ({
  list,
  displayKey,
  setSelectedProject,
  selected,
}) => {
  return (
    <div className="w-72 p-2 z-50">
      <Listbox value={selected} onChange={setSelectedProject}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">
              {selected ? (
                <p>
                  {selected.project_number} - {selected.project_name}
                </p>
              ) : (
                ""
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <TiArrowUnsorted
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {list.map((item, itemIdx) => (
                <Listbox.Option
                  key={itemIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-1 pl-3 pr-4 text-left ${
                      active ? "bg-secondary-font text-white" : "text-gray-900"
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <div className="flex justify-between w-full ">
                      <p
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.project_number} - {item.project_name}
                      </p>
                      {selected && (
                        <TbCheck
                          className={`h-5 w-5 text-white `}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
