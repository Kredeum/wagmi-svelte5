import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isEns, isAddress, shorten0xString, replacer, saveBurnerSK, loadBurnerSK } from '../../src/lib/wagmi/ts/utils';
import { type Address } from 'viem';

declare const global: typeof globalThis;

describe('Address and ENS utilities', () => {
  describe('isEns', () => {
    it('should return false for null or undefined', () => {
      expect(isEns(null)).toBe(false);
      expect(isEns(undefined)).toBe(false);
    });

    it('should return true for valid .eth addresses', () => {
      expect(isEns('vitalik.eth')).toBe(true);
      expect(isEns('test-name.eth')).toBe(true);
    });

    it('should return false for non-.eth addresses', () => {
      expect(isEns('vitalik')).toBe(false);
      expect(isEns('test.com')).toBe(false);
    });
  });

  describe('isAddress', () => {
    it('should return false for null or undefined', () => {
      expect(isAddress(null)).toBe(false);
      expect(isAddress(undefined)).toBe(false);
    });

    it('should return true for valid Ethereum addresses', () => {
      const validAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' as Address;
      expect(isAddress(validAddress)).toBe(true);
    });

    it('should return false for invalid Ethereum addresses', () => {
      expect(isAddress('0xinvalid')).toBe(false);
      expect(isAddress('not an address')).toBe(false);
    });
  });

  describe('shorten0xString', () => {
    it('should shorten address to format: 0x1234...5678', () => {
      const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
      expect(shorten0xString(address as `0x${string}`)).toBe('0x742d35C...8f44e');
    });
  });
});

describe('JSON utilities', () => {
  describe('replacer', () => {
    it('should convert BigInt to string', () => {
      const bigIntValue = BigInt('123456789');
      expect(replacer('test', bigIntValue)).toBe('123456789');
    });

    it('should return non-BigInt values as is', () => {
      expect(replacer('test', 123)).toBe(123);
      expect(replacer('test', 'string')).toBe('string');
      expect(replacer('test', { key: 'value' })).toEqual({ key: 'value' });
    });
  });
});

describe('Burner wallet utilities', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => localStorageMock[key] || null,
        setItem: (key: string, value: string) => {
          localStorageMock[key] = value;
        },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('saveBurnerSK', () => {
    it('should save private key to localStorage', () => {
      const testKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      saveBurnerSK(testKey as `0x${string}`);
      expect(localStorageMock['wagmiSvelte5.burnerWallet.sk']).toBe(testKey);
    });

    it('should handle undefined window object', () => {
      (global as { window: unknown }).window = undefined;
      const testKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      expect(() => saveBurnerSK(testKey as `0x${string}`)).not.toThrow();
    });
  });

  describe('loadBurnerSK', () => {
    it('should load existing private key from localStorage', () => {
      const testKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      localStorageMock['wagmiSvelte5.burnerWallet.sk'] = testKey;
      expect(loadBurnerSK()).toBe(testKey);
    });

    it('should generate new private key if none exists', () => {
      const result = loadBurnerSK();
      expect(result).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    it('should handle invalid localStorage key', () => {
      localStorageMock['wagmiSvelte5.burnerWallet.sk'] = 'invalid-key';
      const result = loadBurnerSK();
      expect(result).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });
  });
});
