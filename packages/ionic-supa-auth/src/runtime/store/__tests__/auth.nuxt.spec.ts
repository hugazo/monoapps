import { setActivePinia, createPinia } from 'pinia';
import { describe, beforeEach, expect, it } from 'vitest';
import useAuth from '../auth';

const mockedUser = {
  id: '123',
  email: 'test@mockedEmail.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2023-01-01T00:00:00.000Z',
};

const mockedFactors = [
  {
    id: '1',
    factor_type: 'totp',
    factor_id: '1234',
    status: 'verified' as const,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
];

const mockedFirstFactor = {
  id: '1234',
  type: 'totp' as const,
  totp: {
    qr_code: 'mockedQRCode',
    secret: 'mockedSecret',
    uri: 'mockedUri',
  },
  created_at: '2023-01-01T00:00:00.000Z',
};

describe('auth store', () => {
  let store: ReturnType<typeof useAuth> | null = null;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useAuth();
  });

  it('should initialize with default values', () => {
    expect(store!.loggedIn).toBe(false);
    expect(store!.user).toBe(null);
    // Checks mfa
    expect(store!.factors).toBe(null);
    expect(store!.firstFactor).toBe(null);
  });

  it('should fill the user', () => {
    store!.user = mockedUser;
    expect(store!.user).toStrictEqual(mockedUser);
    expect(store!.loggedIn).toBe(true);
  });

  it('should set factors', () => {
    store!.factors = mockedFactors;
    expect(store!.factors).toStrictEqual(mockedFactors);
  });

  it('should set first factor', () => {
    store!.firstFactor = mockedFirstFactor;
    expect(store!.firstFactor).toStrictEqual(mockedFirstFactor);
  });

  it('should compute loggedIn based on user', () => {
    store!.user = mockedUser;
    expect(store!.loggedIn).toBe(true);
    store!.user = null;
    expect(store!.loggedIn).toBe(false);
  });

  it('should reset the store', () => {
    store?.$reset();
    expect(store!.user).toBe(null);
    expect(store!.loggedIn).toBe(false);
  });
});
