import { useEffect, useState } from "react";
import { getPaymentSettings } from "./api";

const EMPTY_METHOD = {
  account_name: "",
  account_number: "",
  bank_name: "",
  qr_code_url: "",
};

const DEFAULTS = {
  gcash: EMPTY_METHOD,
  maya: EMPTY_METHOD,
  bank: EMPTY_METHOD,
};

export function usePaymentSettings() {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    let active = true;

    async function fetchSettings() {
      const { data, error } = await getPaymentSettings();

      if (!active || error || !data) return;

      setSettings((prev) => ({
        ...prev,
        ...Object.fromEntries(data.map((row) => [row.method, row])),
      }));
    }

    fetchSettings();

    return () => {
      active = false;
    };
  }, []);

  return settings;
}
