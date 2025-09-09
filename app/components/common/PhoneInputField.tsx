import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber, CountryCode } from "libphonenumber-js";
import "react-phone-number-input/style.css";

interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: CountryCode;
  required?: boolean;
  className?: string;
}

export function PhoneInputField({
  value,
  onChange,
  defaultCountry,
  required = false,
  className = "",
}: PhoneInputFieldProps) {
  return (
    <PhoneInput
      international
      countrySelectProps={{ unicodeFlags: true }}
      value={value}
      onChange={(val) => onChange(val ?? "")}
      defaultCountry={defaultCountry}
      error={
        value
          ? isValidPhoneNumber(value)
            ? undefined
            : "Invalid phone number"
          : required
          ? "Phone number required"
          : undefined
      }
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
    />
  );
}
