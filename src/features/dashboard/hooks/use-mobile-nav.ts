"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useMobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, setIsOpen, close };
}