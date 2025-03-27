/**
 * Extracts query parameters from a URL string
 * @param url - The URL string containing query parameters
 * @param paramName - Optional specific parameter to extract
 * @returns An object with all query parameters or the specific parameter value
 */
export function getQueryParams(url: string, paramName?: string): Record<string, string> | string | null {
  try {
    const urlObj = new URL(url);

    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    if (paramName) {
      return params[paramName] || null;
    }

    return params;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return paramName ? null : {};
  }
}

/**
 * Extracts multiple specific query parameters from a URL
 * @param url - The URL string containing query parameters
 * @param paramNames - Array of parameter names to extract
 * @returns An object with the requested parameters
 */
export function getSpecificQueryParams(url: string, paramNames: string[]): Record<string, string | null> {
  const allParams = getQueryParams(url) as Record<string, string>;

  const result: Record<string, string | null> = {};
  paramNames.forEach((name) => {
    result[name] = allParams[name] || null;
  });

  return result;
}

/**
 * Validates if a payment callback URL contains all required parameters
 * @param url - The payment callback URL
 * @returns Boolean indicating if all required parameters are present
 */
export function validatePaymentCallback(url: string): boolean {
  const requiredParams = ['payment_id', 'trans_id', 'order_id', 'hash'];
  const params = getQueryParams(url) as Record<string, string>;

  return requiredParams.every((param) => !!params[param]);
}
