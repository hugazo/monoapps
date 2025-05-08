declare module '#app' {
  interface PageMeta {
    allowUnauthenticated?: boolean;
    redirectIfAuthenticated?: boolean;
  }
}

export {};
