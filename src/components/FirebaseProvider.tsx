import React, { createContext, useContext, useEffect, useState } from 'react';

interface FirebaseContextType {
  user: any;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {}
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('vinculatec_current_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing stored session: ", e);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: any) => {
    const mappedUser = {
      ...userData,
      uid: userData.id || userData.uid || userData.controlNumber || 'student_id'
    };
    setUser(mappedUser);
    localStorage.setItem('vinculatec_current_user', JSON.stringify(mappedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vinculatec_current_user');
  };

  return (
    <FirebaseContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </FirebaseContext.Provider>
  );
};
