import { CVProfile } from '../types/cv';

const STORAGE_KEY = 'chhunly_cv_profile_v1';

export function encodeProfileToHash(profile: CVProfile): string {
  try {
    const json = JSON.stringify(profile);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch {
    return '';
  }
}

export function decodeProfileFromHash(hashValue: string): CVProfile | null {
  try {
    const cleaned = hashValue.replace(/^#data=/, '');
    if (!cleaned) return null;
    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as CVProfile;
    if (parsed && parsed.contact && parsed.about && Array.isArray(parsed.study)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function loadSavedProfile(fallback: CVProfile): CVProfile {
  if (typeof window === 'undefined') return fallback;

  if (window.location.hash.startsWith('#data=')) {
    const fromHash = decodeProfileFromHash(window.location.hash);
    if (fromHash) return fromHash;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as CVProfile;
    if (parsed && parsed.contact && parsed.about) {
      return parsed;
    }
  } catch {
    // Fallback to default data if storage is unavailable or corrupted
  }
  return fallback;
}

export function saveProfileToStorage(profile: CVProfile): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearSavedProfile(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    if (window.location.hash.startsWith('#data=')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  } catch {
    // Ignore errors
  }
}
