declare module '#app' {
  interface PageMeta {
    allowUnauthenticated?: boolean;
    redirectIfAuthenticated?: boolean;
    allowNonEnrolled?: boolean;
    allowUnverified?: boolean;
  }
}

export {};
