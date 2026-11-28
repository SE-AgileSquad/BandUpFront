import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useUnsavedChanges(dirty: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (!dirty) return;
    const message = "You have unsaved changes. Leave anyway?";
    function beforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = true;
    }
    function linkClicked(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
      event.preventDefault();
      event.stopPropagation();
      if (window.confirm(message)) {
        if (url.origin === location.origin) router.push(url.pathname + url.search + url.hash);
        else {
          window.removeEventListener("beforeunload", beforeUnload);
          window.location.assign(url.href);
        }
      }
    }
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", linkClicked, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", linkClicked, true);
    };
  }, [dirty, router]);
}
