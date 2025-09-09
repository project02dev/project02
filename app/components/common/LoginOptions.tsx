import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

interface LoginOptionsProps {
  onGoogleClick: () => void;
  onGithubClick: () => void;
  className?: string;
}

export function LoginOptions({
  onGoogleClick,
  onGithubClick,
  className = "",
}: LoginOptionsProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <button
        onClick={onGoogleClick}
        type="button"
        className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50 transition"
      >
        <FcGoogle className="text-xl" />
        <span>Continue with Google</span>
      </button>
      <button
        onClick={onGithubClick}
        type="button"
        className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50 transition"
      >
        <FaGithub className="text-xl" />
        <span>Continue with GitHub</span>
      </button>
    </div>
  );
}
