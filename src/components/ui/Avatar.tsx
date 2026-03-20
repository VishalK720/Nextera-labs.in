"use client";

import * as React from "react";
import { cn, getInitials } from "@/lib/utils";

const sizeMap = {
  sm: { dimension: 32, text: "text-xs" },
  md: { dimension: 40, text: "text-sm" },
  lg: { dimension: 56, text: "text-base" },
} as const;

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  color?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, src, size = "md", color = "#F5A623", className, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);
    const { dimension, text } = sizeMap[size];
    const initials = getInitials(name);
    const showImage = src && !imgError;

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
          className
        )}
        style={{ width: dimension, height: dimension }}
        title={name}
        role="img"
        aria-label={name}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center font-medium select-none",
              text
            )}
            style={{ backgroundColor: `${color}20`, color }}
          >
            {initials}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
export default Avatar;
