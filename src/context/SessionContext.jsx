import { createContext, useContext, useEffect, useState } from "react";

const SessionContext = createContext(null);

const SESSION_STORAGE_KEY = "hotel_customer_session";

const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);

      return savedSession ? JSON.parse(savedSession) : null;
    } catch (error) {
      console.error("Failed to load customer session:", error);
      return null;
    }
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [session]);

  const saveSession = (sessionData) => {
    // console.log("Saving session:", sessionData);

    setSession({
      sessionToken: sessionData?.sessionToken || "",
      customerName: sessionData?.customerName || "",
      table: sessionData?.table || null,
    });
  };

  const clearSession = () => {
    setSession(null);
  };

  const value = {
    session,
    saveSession,
    clearSession,

    sessionToken: session?.sessionToken || "",
    customerName: session?.customerName || "",
    table: session?.table || null,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used inside SessionProvider");
  }

  return context;
};

export default SessionProvider;
