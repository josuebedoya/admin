"use client";
import React, {useEffect, useState} from "react";
import {Dropdown} from "../ui/dropdown/Dropdown";
import {DropdownItem} from "../ui/dropdown/DropdownItem";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string | number) => void;
  className?: string;
  defaultValue?: string;
  name: string;
}

const Select: React.FC<SelectProps> = ({
                                         options,
                                         placeholder = "Select an option",
                                         onChange,
                                         className = "",
                                         defaultValue = "",
                                         name,
                                       }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number>(defaultValue);

  // Sincronizar con defaultValue cuando cambie
  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  // Encontrar el label de la opción seleccionada
  const selectedOption = options.find(opt => opt.value === selectedValue);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleSelect = (value: string | number) => {
    setSelectedValue(value);
    onChange(value);
    closeDropdown();
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={toggleDropdown}
        className={`dropdown-toggle h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-left text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800 ${
          selectedValue
            ? "text-gray-800 dark:text-white/90"
            : "text-gray-400 dark:text-gray-400"
        } ${className}`}
      >
        <span className="flex items-center justify-between">
          <span className="truncate">{displayValue}</span>
          <svg
            className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="mt-2 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="py-1">
          {options.map((option) => (
            <DropdownItem
              key={option.value}
              onItemClick={() => handleSelect(option.value)}
              baseClassName={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                selectedValue === option.value
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {option.label}
            </DropdownItem>
          ))}
        </div>
      </Dropdown>

      {/* Hidden input para formularios */}
      <input type="hidden" name={name} value={selectedValue}/>
    </div>
  );
};

export default Select;
