import { Eye, EyeOff, Loader2, type LucideIcon } from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  eye: Eye,
  eyeOff: EyeOff,
  spinner: Loader2,
  google: ({ ...props }) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 256S109.8 0 244 0c73.2 0 136.2 29.3 182.4 75.8L345 152.4C319.5 129.5 284.5 112 244 112c-80.6 0-146 65.4-146 146s65.4 146 146 146c88.7 0 125.7-57.8 132.3-88.7H244v-71.4h236.1c2.4 12.7 3.9 26.1 3.9 40.1z"
      />
    </svg>
  ),
};
