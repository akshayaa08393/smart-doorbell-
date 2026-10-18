// Authentication Service supporting both Firebase Auth and Demo/Mock Mode
import { isFirebaseActive, auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";

const USER_STORAGE_KEY = "smartguard_current_user";
const REMEMBER_ME_KEY = "smartguard_remember_me";

export const DEFAULT_DEMO_USER = {
  uid: "demo_homeowner_01",
  email: "homeowner@smartguard.com",
  displayName: "Akshaya (Homeowner)",
  role: "Primary Resident",
  homeAddress: "Residence 402, North Haven",
  isMock: true,
  createdAt: new Date().toISOString()
};

class AuthService {
  constructor() {
    this.currentUser = this.loadUser();
    this.listeners = new Set();
  }

  loadUser() {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load user session:", e);
    }
    // Default logged in user for immediate seamless experience, or null
    return DEFAULT_DEMO_USER;
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    this.notify();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.currentUser);
    return () => this.listeners.delete(callback);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return Boolean(this.currentUser);
  }

  /**
   * Login with email and password
   */
  async login({ email, password, rememberMe = false }) {
    if (rememberMe) {
      localStorage.setItem(REMEMBER_ME_KEY, email);
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }

    if (isFirebaseActive() && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        const appUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || email.split("@")[0],
          isMock: false
        };
        this.setCurrentUser(appUser);
        return appUser;
      } catch (err) {
        throw new Error(err.message || "Failed to sign in with Firebase");
      }
    }

    // Demo Mode Sign-in
    await new Promise((r) => setTimeout(r, 600));

    const appUser = {
      uid: `demo_${Date.now()}`,
      email: email.trim(),
      displayName: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      role: "Homeowner",
      homeAddress: "Residence 402, North Haven",
      isMock: true,
      lastLogin: new Date().toISOString()
    };

    this.setCurrentUser(appUser);
    return appUser;
  }

  /**
   * Register a new user
   */
  async register({ fullName, email, password }) {
    if (isFirebaseActive() && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        await updateProfile(fbUser, { displayName: fullName });
        const appUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fullName,
          isMock: false
        };
        this.setCurrentUser(appUser);
        return appUser;
      } catch (err) {
        throw new Error(err.message || "Failed to register user in Firebase");
      }
    }

    // Demo Mode Registration
    await new Promise((r) => setTimeout(r, 700));

    const appUser = {
      uid: `user_${Date.now()}`,
      email: email.trim(),
      displayName: fullName.trim(),
      role: "Primary Resident",
      homeAddress: "Residence 402, North Haven",
      isMock: true,
      createdAt: new Date().toISOString()
    };

    this.setCurrentUser(appUser);
    return appUser;
  }

  /**
   * Quick 1-click Demo Login for effortless faculty demonstration
   */
  demoLogin() {
    this.setCurrentUser({ ...DEFAULT_DEMO_USER });
    return DEFAULT_DEMO_USER;
  }

  /**
   * Logout
   */
  async logout() {
    if (isFirebaseActive() && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn("Firebase signout error:", err);
      }
    }
    this.setCurrentUser(null);
  }

  getRememberedEmail() {
    return localStorage.getItem(REMEMBER_ME_KEY) || "";
  }
}

export const authService = new AuthService();
export default authService;
