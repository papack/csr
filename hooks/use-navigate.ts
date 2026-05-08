// use-navigate.ts
function isExternalUrl(url: string): boolean {
  return url.includes("://");
}

function notifyLocationChange() {
  window.dispatchEvent(new PopStateEvent("popstate"));

  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export function useNavigate() {
  const navigate = (to: string | ((prev: string) => string)) => {
    const current =
      window.location.pathname + window.location.search + window.location.hash;

    const next = typeof to === "function" ? to(current) : to;

    // external
    if (isExternalUrl(next)) {
      window.location.href = next;
      return;
    }

    // internal
    window.history.pushState(null, "", next);

    // sync hooks
    notifyLocationChange();
  };

  return {
    navigate,
  };
}
