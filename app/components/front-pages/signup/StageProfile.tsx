/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getCountries, type Country } from "@/lib/constants";
import { CountrySelect } from "@/components/common/CountrySelect";
import { PhoneInputField } from "@/components/common/PhoneInputField";

interface StageProfileProps {
  formData: any;
  setFormData: (data: any) => void;
  nextStage: () => void;
  prevStage: () => void;
}

export function StageProfile({
  formData,
  setFormData,
  nextStage,
  prevStage,
}: StageProfileProps) {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const loadCountries = async () => {
      const data = await getCountries();
      setCountries(data);
    };

    loadCountries();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStage();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="dob"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Date of Birth *
        </label>
        <input
          id="dob"
          name="dob"
          type="date"
          required
          value={formData.dob || ""}
          onChange={handleChange}
          max={new Date().toISOString().split("T")[0]}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Country *
        </label>
        <CountrySelect
          countries={countries}
          value={formData.country || ""}
          onChange={(value) => setFormData({ ...formData, country: value })}
          required
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={prevStage}
          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
