import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp, type DocumentData } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import type { User, UpdateProfileInput, LoginCredentials, RegisterInput } from "@/types";

/**
 * Auth service backed by real Firebase Authentication + Firestore.
 * Auth handles credentials/identity; the `users/{uid}` Firestore document
 * holds app-specific profile fields (bio, phoneNumber) that Firebase Auth
 * itself doesn't store.
 */

interface UserDocShape {
  name?: string;
  email?: string;
  photoURL?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
}

function readUserDoc(data: DocumentData): UserDocShape {
  return data as UserDocShape;
}

function timestampToIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return new Date().toISOString();
}

async function loadOrCreateUserDoc(firebaseUser: FirebaseUser, nameOverride?: string): Promise<User> {
  const userRef = doc(db, "users", firebaseUser.uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    const data = readUserDoc(snapshot.data());
    return {
      uid: firebaseUser.uid,
      name: data.name ?? firebaseUser.displayName ?? "",
      email: data.email ?? firebaseUser.email ?? "",
      photoURL: data.photoURL ?? firebaseUser.photoURL ?? null,
      phoneNumber: data.phoneNumber ?? undefined,
      bio: data.bio ?? undefined,
      emailVerified: firebaseUser.emailVerified,
      createdAt: timestampToIso(data.createdAt),
      updatedAt: timestampToIso(data.updatedAt),
    };
  }

  // First time we see this uid (fresh register, or first Google sign-in) — create the profile doc.
  const name = nameOverride ?? firebaseUser.displayName ?? "";
  const newUserData = {
    name,
    email: firebaseUser.email ?? "",
    photoURL: firebaseUser.photoURL ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(userRef, newUserData);

  const nowIso = new Date().toISOString();
  return {
    uid: firebaseUser.uid,
    name,
    email: firebaseUser.email ?? "",
    photoURL: firebaseUser.photoURL ?? null,
    emailVerified: firebaseUser.emailVerified,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
  return loadOrCreateUserDoc(result.user);
}

export async function register(input: RegisterInput): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, input.email, input.password);
  // Set the display name on the Firebase Auth profile itself too, so it's available
  // immediately via onAuthStateChanged even before the Firestore doc round-trip.
  await firebaseUpdateProfile(result.user, { displayName: input.name });
  return loadOrCreateUserDoc(result.user, input.name);
}

export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return loadOrCreateUserDoc(result.user);
}

export async function logout(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  if (!email) {
    throw new Error("Email wajib diisi");
  }
  await firebaseSendPasswordResetEmail(auth, email);
}

export async function getCurrentUser(): Promise<User | null> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;
  return loadOrCreateUserDoc(firebaseUser);
}

export async function updateProfile(input: UpdateProfileInput): Promise<User> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    throw new Error("Tidak ada pengguna yang sedang masuk");
  }

  await firebaseUpdateProfile(firebaseUser, { displayName: input.name });

  const userRef = doc(db, "users", firebaseUser.uid);
  await updateDoc(userRef, {
    name: input.name,
    email: input.email,
    phoneNumber: input.phoneNumber ?? null,
    bio: input.bio ?? null,
    updatedAt: serverTimestamp(),
  });

  return loadOrCreateUserDoc(firebaseUser);
}

/**
 * Subscribes to Firebase's auth state. Used by AuthContext so login state
 * persists across page reloads instead of resetting every time, unlike the
 * previous mock implementation.
 */
export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    void loadOrCreateUserDoc(firebaseUser).then(callback);
  });
}
