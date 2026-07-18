// utils/fetchJSON.js

// Simple in-memory cache to prevent redundant HTTP requests for static assets
const fetchCache = new Map();

/**
 * Fetches a JSON resource, validates key structural requirements, and caches the result.
 * @param {string} url - Relative path to the JSON file
 * @param {Array<string>} [requiredKeys=[]] - List of top-level keys required in the root object
 * @returns {Promise<any>} Parsed JSON content
 */
export async function fetchJSON(url, requiredKeys = []) {
  // Return cached promise if available to handle concurrent calls for the same URL
  if (fetchCache.has(url)) {
    return fetchCache.get(url);
  }

  const fetchPromise = (async () => {
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Perform runtime validation
      validateSchema(url, data, requiredKeys);
      
      return data;
    } catch (error) {
      // Clear cache on failure so future attempts can retry
      fetchCache.delete(url);
      console.error(`[Data Layer] Error loading resource from "${url}":`, error);
      throw error;
    }
  })();

  fetchCache.set(url, fetchPromise);
  return fetchPromise;
}

/**
 * Lightweight runtime schema validator to ensure file structure matches requirements.
 * @param {string} url - Resource path for context
 * @param {any} data - Data to validate
 * @param {Array<string>} requiredKeys - Mandatory top-level keys
 */
function validateSchema(url, data, requiredKeys) {
  if (!requiredKeys || requiredKeys.length === 0) return;

  if (typeof data !== 'object' || data === null) {
    console.warn(`[Data Layer] [Validation Warning] Resource "${url}" was expected to be an object, but got ${typeof data}`);
    return;
  }

  const missingKeys = [];
  for (const key of requiredKeys) {
    if (!(key in data)) {
      missingKeys.push(key);
    }
  }

  if (missingKeys.length > 0) {
    console.warn(`[Data Layer] [Validation Warning] Resource "${url}" is missing required fields: ${missingKeys.join(', ')}`);
  }
}
