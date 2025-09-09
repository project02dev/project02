import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Country } from "@/lib/constants";

interface CountrySelectProps {
  countries: Country[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function CountrySelect({
  countries,
  value,
  onChange,
  required,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCountry = countries.find((c) => c.code === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-left flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCountry ? (
          <span className="flex items-center gap-2">
            <Image
              src={selectedCountry.flag}
              alt={`${selectedCountry.name} flag`}
              width={24}
              height={16}
              className="object-cover rounded-sm"
            />
            <span>{selectedCountry.name}</span>
          </span>
        ) : (
          <span className="text-gray-500">Select a country</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                className={`w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 ${
                  value === country.code ? "bg-indigo-50" : ""
                }`}
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                  setSearchQuery("");
                }}
              >
                <Image
                  src={country.flag}
                  alt={`${country.name} flag`}
                  width={24}
                  height={16}
                  className="object-cover rounded-sm"
                />
                <span>{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <input type="hidden" name="country" value={value} required={required} />
    </div>
  );
}
