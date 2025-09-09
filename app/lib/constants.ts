/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Country {
  code: string;
  name: string;
  flag: string;
}

export async function getCountries(): Promise<Country[]> {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,flags"
    );
    const data = await response.json();

    return data
      .map((country: any) => ({
        code: country.cca2,
        name: country.name.common,
        // Use emoji flag instead of SVG URL
        flag: getFlagEmoji(country.cca2),
      }))
      .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    return defaultCountries;
  }
}

// Helper function to convert country code to flag emoji
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Fallback countries
export const defaultCountries: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  // ... add more default countries if needed
];
