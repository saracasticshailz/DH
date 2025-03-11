// src/services/kony-service.ts
import { useEffect, useState } from 'react';

// Check if kony is available
const isKonyAvailable = () => {
  return typeof window !== 'undefined' && typeof window.kony !== 'undefined';
};

// Wait for kony to be available
const waitForKony = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (isKonyAvailable()) {
      resolve(window.kony);
      return;
    }

    // Try for up to 5 seconds
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (isKonyAvailable()) {
        clearInterval(interval);
        resolve(window.kony);
      } else if (attempts > 50) {
        // 50 * 100ms = 5 seconds
        clearInterval(interval);
        reject(new Error('Kony SDK not available after 5 seconds'));
      }
    }, 100);
  });
};

// Hook to use Kony SDK
export const useKonySDK = () => {
  const [konySDK, setKonySDK] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    waitForKony()
      .then((kony) => {
        setKonySDK(kony);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load Kony SDK:', err);
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return { konySDK, error, isLoading };
};

// Direct access to Kony SDK (use with caution)
export const getKonySDK = async () => {
  if (isKonyAvailable()) {
    return window.kony;
  }
  return waitForKony();
};

// Example function using Kony SDK
export const exampleKonyFunction = async () => {
  try {
    const kony = await getKonySDK();
    // Use kony SDK here
    return kony.someMethod();
  } catch (error) {
    console.error('Error using Kony SDK:', error);
    throw error;
  }
};
