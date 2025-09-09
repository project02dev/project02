import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface SuccessMessageProps {
  title: string;
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}

export function SuccessMessage({
  title,
  message,
  buttonText,
  onButtonClick,
}: SuccessMessageProps) {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">{title}</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>{message}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={onButtonClick}
                className="rounded-md bg-green-50 text-sm font-medium text-green-800 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
