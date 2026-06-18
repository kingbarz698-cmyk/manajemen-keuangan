/**
 * User & authentication domain types.
 * Mirrors Firestore document `users/{userId}` per PRD §31.
 * Covers PRD §9 (Authentication) and §10 (Profile Management).
 */

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
  phoneNumber?: string;
  bio?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  name: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

/** Password rule per PRD §10 Change Password: min 8 chars, 1 upper, 1 lower, 1 number */
export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "Min. 8 karakter", test: (pw) => pw.length >= 8 },
  { label: "1 huruf besar", test: (pw) => /[A-Z]/.test(pw) },
  { label: "1 huruf kecil", test: (pw) => /[a-z]/.test(pw) },
  { label: "1 angka", test: (pw) => /[0-9]/.test(pw) },
];
