import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

import { auth, db, firebaseReady } from "../firebase/firebase.js";

const AuthContext = createContext(null);

function getUserData(firebaseUser, role = "student") {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name:
      firebaseUser.displayName ||
      firebaseUser.email.split("@")[0],
    role
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let role = "student";

        if (userSnap.exists()) {
          role = userSnap.data().role || "student";
        }

        setUser(getUserData(firebaseUser, role));
      } catch (error) {
        console.error("User data error:", error);
        setUser(null);
      }

      setLoading(false);
    });
  }, []);

  async function register(name, email, password) {
    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(result.user, {
      displayName: name
    });

    await setDoc(doc(db, "users", result.user.uid), {
      name,
      email,
      role: "student",
      createdAt: new Date().toISOString()
    });

    const nextUser = getUserData(result.user, "student");

    setUser(nextUser);

    return nextUser;
  }

  async function login(email, password, selectedRole) {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userRef = doc(db, "users", result.user.uid);
    const userSnap = await getDoc(userRef);

    let role = "student";

    if (userSnap.exists()) {
      role = userSnap.data().role || "student";
    }

    if (role !== selectedRole) {
      await signOut(auth);
      throw new Error(
        `This account is registered as ${role}.`
      );
    }

    const nextUser = getUserData(result.user, role);

    setUser(nextUser);

    return nextUser;
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        firebaseReady
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);