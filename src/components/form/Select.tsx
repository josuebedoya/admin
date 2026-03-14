"use client";
import React, {useEffect, useMemo, useRef, useState} from "react";
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
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => Promise<Option[]> | Option[];
}

const Select: React.FC<SelectProps> = ({
                                         options,
                                         placeholder = "Select an option",
                                         onChange,
                                         className = "",
                                         defaultValue = "",
                                         name,
                                         searchable = false,
                                         searchPlaceholder = "Buscar...",
                                         onSearch,
                                       }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number>(defaultValue);
  const [searchTerm, setSearchTerm] = useState("");
  const [remoteOptions, setRemoteOptions] = useState<Option[]>(options);
  const [isSearching, setIsSearching] = useState(false);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Sincronizar con defaultValue cuando cambie
  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setRemoteOptions(options);
  }, [options]);

  useEffect(() => {
    const currentOnSearch = onSearchRef.current;
    if (!searchable || !currentOnSearch || !isOpen) {
      return;
    }

    const query = searchTerm.trim();
    if (!query) {
      setIsSearching(false);
      setRemoteOptions(options);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await currentOnSearch(query);
        setRemoteOptions(Array.isArray(results) ? results : []);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen, options, searchTerm, searchable]);

  const visibleOptions = useMemo(() => {
    if (!searchable) {
      return options;
    }

    if (onSearch) {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      return normalizedSearch ? remoteOptions : options;
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return options;
    }

    return options.filter((option) => option.label.toLowerCase().includes(normalizedSearch));
  }, [onSearch, options, remoteOptions, searchable, searchTerm]);

  const selectedOption = [...visibleOptions, ...options].find((opt) => opt.value === selectedValue);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchTerm("");
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm("");
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
        {searchable && (
          <div className="px-3 pt-3 pb-2 border-b border-gray-200 dark:border-gray-800">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>
        )}
        <div className="py-1">
          {isSearching && (
            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Buscando...</div>
          )}
          {!isSearching && visibleOptions.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Sin resultados</div>
          )}
          {!isSearching && visibleOptions.map((option) => (
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
