"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(
  null,
);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);

  if (!context) {
    throw new Error("DropdownMenu components must be used inside DropdownMenu.");
  }

  return context;
}

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function DropdownMenuTrigger({
  asChild = false,
  children,
  onClick,
  ...props
}: DropdownMenuTriggerProps) {
  const { open, setOpen } = useDropdownMenu();

  const triggerProps = {
    "aria-expanded": open,
    "aria-haspopup": "menu" as const,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpen((current) => !current);
      onClick?.(event);
    },
    ...props,
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
      triggerProps as React.HTMLAttributes<HTMLElement>,
    );
  }

  return (
    <button type="button" {...triggerProps}>
      {children}
    </button>
  );
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
}

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ align = "center", className, ...props }, ref) => {
  const { open } = useDropdownMenu();

  if (!open) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-2 min-w-40 overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-lg",
        align === "end" && "right-0",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        className,
      )}
      role="menu"
      {...props}
    />
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

function DropdownMenuItem({
  asChild = false,
  className,
  children,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenu();
  const itemClassName = cn(
    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
    className,
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
      {
        className: cn(
          itemClassName,
          (children.props as { className?: string }).className,
        ),
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          setOpen(false);
          onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
          (children.props as { onClick?: React.MouseEventHandler<HTMLElement> })
            .onClick?.(event);
        },
      },
    );
  }

  return (
    <div
      className={itemClassName}
      role="menuitem"
      onClick={(event) => {
        setOpen(false);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
};
