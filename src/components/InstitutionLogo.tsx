import { cn } from "@/lib/utils";

interface InstitutionLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
};

export const InstitutionLogo = ({ size = "md", className }: InstitutionLogoProps) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full bg-gradient-to-br from-navy to-navy-dark shadow-lg overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      <img
        src="/institution-logo.png"
        alt="Institution Logo"
        className="w-full h-full object-contain p-2"
      />
    </div>
  );
};
