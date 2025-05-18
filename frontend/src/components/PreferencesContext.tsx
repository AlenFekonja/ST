import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import axios from "axios";
import { getAndParseJWT } from "./jwt.tsx";

export const THEME_OPTIONS = ["light", "dark", "system"] as const;
export const FONT_OPTIONS = ["sans-serif", "serif", "monospace"] as const;
export const LAYOUT_OPTIONS = ["grid", "list", "compact"] as const;

export type ThemeOption = (typeof THEME_OPTIONS)[number];
export type FontOption = (typeof FONT_OPTIONS)[number];
export type LayoutOption = (typeof LAYOUT_OPTIONS)[number];

export interface Preference {
  _id?: string;
  user_id?: string;
  theme: ThemeOption;
  font: FontOption;
  layout: LayoutOption;
  active: boolean;
}

interface PreferencesContextType {
  preference: Preference | null;
  refreshPreference: () => void;
  updatePreference: (updated: Partial<Preference>) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType>({
  preference: null,
  refreshPreference: () => {},
  updatePreference: async () => {},
});

export const usePreferences = () => useContext(PreferencesContext);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreference] = useState<Preference | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchActivePreference = async () => {
    const userId = getAndParseJWT()?.payload.id;
    if (!userId) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/${userId}`
      );
      const active = response.data.find((p: Preference) => p.active === true);
      setPreference(active || response.data[0] || null);
    } catch (error) {
      console.error("Error fetching active preference", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (updated: Partial<Preference>) => {
    if (!preference || !preference._id) return;
    try {
      await axios.put(
        `http://localhost:5000/preferences/${preference._id}`,
        updated
      );
      await fetchActivePreference();
    } catch (error) {
      console.error("Error updating preference", error);
    }
  };

  useEffect(() => {
    fetchActivePreference();
  }, []);

  useEffect(() => {
    if (!preference) return;

    // Theme
    document.body.classList.remove("theme-light", "theme-dark");
    if (preference.theme === "light") {
      document.body.classList.add("theme-light");
    } else if (preference.theme === "dark") {
      document.body.classList.add("theme-dark");
    }

    // Font (with fallback)
    document.body.style.fontFamily = preference.font || "sans-serif";

    // Layout
    document.body.classList.remove(
      "layout-grid",
      "layout-list",
      "layout-compact"
    );
    if (preference.layout) {
      document.body.classList.add(`layout-${preference.layout}`);
    }
  }, [preference]);

  if (loading) return null; // ali Spinner komponenta

  return (
    <PreferencesContext.Provider
      value={{
        preference,
        refreshPreference: fetchActivePreference,
        updatePreference,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
