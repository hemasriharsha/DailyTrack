import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface UserPreferences {
  darkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  dataBackup: boolean;
  defaultView: "dashboard" | "today" | "calendar";
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
}

interface PreferencesContextType {
  preferences: UserPreferences;
  profile: UserProfile;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  updateProfile: (prof: Partial<UserProfile>) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined,
);

const DEFAULT_PREFERENCES: UserPreferences = {
  darkMode: false,
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: true,
  dataBackup: true,
  defaultView: "dashboard",
};

const DEFAULT_PROFILE: UserProfile = {
  name: "Alex Johnson",
  email: "alex@example.com",
  bio: "Goal setter and habit builder",
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem("user-preferences");
    return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem("user-profile");
    return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem("user-preferences", JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem("user-profile", JSON.stringify(profile));
  }, [profile]);

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
  };

  const updateProfile = (prof: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...prof }));
  };

  return (
    <PreferencesContext.Provider
      value={{ preferences, profile, updatePreferences, updateProfile }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}
