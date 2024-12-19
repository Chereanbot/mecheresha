"use client";

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { HiCheck, HiX, HiDownload } from 'react-icons/hi';

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: 'check' | 'x' | 'download';
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

const icons = {
  check: HiCheck,
  x: HiX,
  download: HiDownload
};

export function Dropdown({ trigger, items, align = 'right' }: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Fragment}>
        {trigger}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items 
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => {
                  const Icon = item.icon ? icons[item.icon] : null;
                  return (
                    <button
                      onClick={item.onClick}
                      disabled={item.disabled}
                      className={`
                        ${active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}
                        ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        group flex w-full items-center px-4 py-2 text-sm
                      `}
                    >
                      {Icon && (
                        <Icon
                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                      {item.label}
                    </button>
                  );
                }}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 