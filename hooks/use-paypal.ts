import type { PayPalNamespace } from "@paypal/paypal-js";

declare global {
  interface Window {
    paypal?: PayPalNamespace | null;
  }
}

type UsePaypalOptions = {
  sandbox?: boolean;
};

let paypalPromise: Promise<PayPalNamespace> | null = null;

export function usePaypal(clientId: string, options: UsePaypalOptions = {}) {
  const { sandbox = true } = options;

  async function loadPaypal(): Promise<PayPalNamespace> {
    if (window.paypal) {
      return window.paypal;
    }

    if (paypalPromise) {
      return paypalPromise;
    }

    paypalPromise = new Promise<PayPalNamespace>((resolve, reject) => {
      const script = document.createElement("script");

      const base = sandbox
        ? "https://www.sandbox.paypal.com"
        : "https://www.paypal.com";

      script.src = `${base}/sdk/js?client-id=${clientId}`;

      script.async = true;

      script.onload = () => {
        if (!window.paypal) {
          reject(new Error("PayPal SDK loaded but window.paypal is undefined"));

          return;
        }

        resolve(window.paypal);
      };

      script.onerror = () => {
        reject(new Error("Failed to load PayPal SDK"));
      };

      document.body.appendChild(script);
    });

    return paypalPromise;
  }

  return {
    loadPaypal,
  };
}
