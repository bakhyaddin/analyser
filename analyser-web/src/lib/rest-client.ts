export class RestClient {
  baseURL: string;
  private headers: Record<string, string>;

  constructor(headers: Record<string, string> = {}) {
    this.baseURL = `${window.location.protocol}//${window.location.hostname}/api`;
    this.headers = headers;
  }

  async request<T>(
    endpoint: string,
    method: string = "GET",
    body: unknown = null,
    customHeaders: Record<string, string> = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: { ...this.headers, ...customHeaders },
    };

    if (body) {
      options.body = JSON.stringify(body);
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `HTTP ${response.status} - ${response.statusText}: ${errorBody}`
        );
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return (await response.text()) as unknown as T;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  get<T>(
    endpoint: string,
    customHeaders: Record<string, string> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, "GET", null, customHeaders);
  }

  post<T>(
    endpoint: string,
    body: unknown,
    customHeaders: Record<string, string> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, "POST", body, customHeaders);
  }

  put<T>(
    endpoint: string,
    body: unknown,
    customHeaders: Record<string, string> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, "PUT", body, customHeaders);
  }

  patch<T>(
    endpoint: string,
    body: unknown,
    customHeaders: Record<string, string> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, "PATCH", body, customHeaders);
  }

  delete<T>(
    endpoint: string,
    customHeaders: Record<string, string> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, "DELETE", null, customHeaders);
  }
}
