import { HttpParams } from '@angular/common/http';

/**
 * Builds HttpParams from an object, omitting null/undefined values
 * @param params Object with key-value pairs
 * @returns HttpParams instance with only defined values
 */
export function buildHttpParams(params: Record<string, unknown>): HttpParams {
  let httpParams = new HttpParams();

  for (const key of Object.keys(params)) {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      httpParams = httpParams.set(key, String(value));
    }
  }

  return httpParams;
}

