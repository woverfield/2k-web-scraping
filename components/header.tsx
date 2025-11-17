"use client";
import React from "react";
import { createPortal } from "react-dom";
import { Logo } from "@/components/logo";
import { MenuToggleIcon } from "@/components/menu-toggle-icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { Github, Icon } from "lucide-react";
import { basketball } from "@lucide/lab";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  const links = [
    {
      label: "Documentation",
      href: "/docs",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "GitHub",
      href: "https://github.com/woverfield/2k-web-scraping",
    },
  ];

  React.useEffect(() => {
    if (open) {
      // Disable scroll
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scroll
      document.body.style.overflow = "";
    }

    // Cleanup when component unmounts (important for Next.js)
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-4xl border-b border-transparent bg-background dark:bg-background md:rounded-md md:border md:border-transparent md:transition-all md:ease-out",
        {
          "border-slate-200 bg-slate-50/95 backdrop-blur-lg supports-[backdrop-filter]:bg-slate-50/50 md:top-4 md:max-w-3xl md:border-slate-200 md:shadow dark:border-slate-800 dark:bg-slate-900/95 dark:supports-[backdrop-filter]:bg-slate-900/50 dark:md:border-slate-800":
            scrolled,
        }
      )}
    >
      <nav
        className={cn(
          "flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
          {
            "md:px-2": scrolled,
          }
        )}
      >
        <a className="rounded-md p-2 hover:bg-accent" href="/">
          <Logo />
        </a>
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link, i) => (
            <a
              className={buttonVariants({ variant: "ghost" })}
              href={link.href}
              key={i}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {link.label === "GitHub" && <Github className="h-4 w-4" />}
              {link.label}
            </a>
          ))}
          <Button asChild>
            <a href="/dashboard">Get API Key</a>
          </Button>
        </div>
        <Button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          size="icon"
          variant="outline"
        >
          <MenuToggleIcon className="size-5" duration={300} open={open} />
        </Button>
      </nav>

      <MobileMenu className="flex flex-col justify-between gap-2" open={open}>
        <div className="grid gap-y-2">
          {links.map((link) => (
            <a
              className={buttonVariants({
                variant: "ghost",
                className: "justify-start",
              })}
              href={link.href}
              key={link.label}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {link.label === "GitHub" && <Github className="mr-2 h-4 w-4" />}
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Button className="w-full" asChild>
            <a href="/dashboard">Get API Key</a>
          </Button>
        </div>
      </MobileMenu>
    </header>
  );
}

type MobileMenuProps = React.ComponentProps<"div"> & {
  open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "bg-slate-50/95 backdrop-blur-lg supports-[backdrop-filter]:bg-slate-50/50 dark:bg-slate-900/95 dark:supports-[backdrop-filter]:bg-slate-900/50",
        "fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y border-slate-200 dark:border-slate-800 md:hidden"
      )}
      id="mobile-menu"
    >
      <div
        className={cn(
          "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
          "size-full p-4",
          className
        )}
        data-slot={open ? "open" : "closed"}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
