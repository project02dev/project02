/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { PhoneInputField } from "@/components/common/PhoneInputField";
import { FilePreview } from "./FilePreview";

interface StageVerificationProps {
  formData: any;
  setFormData: (data: any) => void;
  prevStage: () => void;
  onSubmit: () => void;
  verificationTypes: any[];
}

export function StageVerification({
  formData,
  setFormData,
  prevStage,
  onSubmit,
  verificationTypes,
}: StageVerificationProps) {
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [credentialPreviews, setCredentialPreviews] = useState<
    Record<string, string | null>
  >({});

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (field === "idVerification") {
          setIdPreview(reader.result as string);
        } else {
          setCredentialPreviews((prev) => ({
            ...prev,
            [field]: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
      setFormData({
        ...formData,
        [field]: file,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <PhoneInputField
          value={formData.phone || ""}
          onChange={(value) => setFormData({ ...formData, phone: value })}
          defaultCountry={formData.country}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID Verification *
        </label>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <input
              type="file"
              name="idVerification"
              accept="image/*,.pdf"
              required
              onChange={(e) => handleFileChange(e, "idVerification")}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
            {idPreview && <FilePreview file={idPreview} />}
            <p className="mt-1 text-xs text-gray-500">
              Upload a government-issued ID (passport, driver&apos;s license,
              etc.)
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professional Credentials
        </label>
        <div className="space-y-4">
          {verificationTypes.map((type: any) => (
            <div key={type.id} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">{type.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{type.description}</p>
              <input
                type="file"
                name={`credential_${type.id}`}
                accept={type.allowedFileTypes}
                onChange={(e) => handleFileChange(e, `credential_${type.id}`)}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
              {credentialPreviews[`credential_${type.id}`] && (
                <FilePreview
                  file={credentialPreviews[`credential_${type.id}`]!}
                />
              )}
            </div>
          ))}
        </div>
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
          Complete Registration
        </button>
      </div>
    </form>
  );
}
