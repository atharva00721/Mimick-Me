import { auth as authFunction, handlers, signIn, signOut, authInstance } from "./config";

export { handlers, signIn, signOut };
export const auth = authFunction;
export const getSession = authFunction;
export const betterAuth = authInstance;
