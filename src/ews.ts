const BASE_URL = "https://api.addons.microsoftedge.microsoft.com/v1/products";

export class EWSClient {
  private readonly apiKey: string;
  private readonly clientId: string;

  constructor({
    apiKey,
    clientId,
  }: {
    apiKey: string;
    clientId: string;
  }) {
    this.apiKey = apiKey;
    this.clientId = clientId;
  }

  async updateItem(productId: string, zip: Blob): Promise<string> {
    const response = await this.proceed(
      "POST",
      `/${productId}/submissions/draft/package`,
      {
        "Content-Type": "application/zip",
      },
      zip,
    );
    if (response.status === 202) {
      if (!response.headers.has("Location")) {
        throw new Error("operationID not found");
      }
      return response.headers.get("Location") as string;
    }
    throw new Error(`Failed to update item: ${response.status} ${response.statusText}`);
  }

  async publishItem(productId: string): Promise<string> {
    const response = await this.proceed("POST", `/${productId}/submissions`);
    if (response.status === 202) {
      if (!response.headers.has("Location")) {
        throw new Error("operationID not found");
      }
      return response.headers.get("Location") as string;
    }
    throw new Error(`Failed to publish item: ${response.status} ${response.statusText}`);
  }

  private async proceed(method: string, path: string, customHeaders?: Record<string, string>, body?: BodyInit): Promise<Response> {
    const url = `${BASE_URL}${path}`;
    const headers: Record<string, string> = {
      Authorization: `ApiKey ${this.apiKey}`,
      "X-ClientID": `${this.clientId}`,
    };
    if (customHeaders) {
      for (const [key, value] of Object.entries(customHeaders)) {
        headers[key] = value;
      }
    }

    const resp = await fetch(url, { method, headers, body });
    if (resp.status >= 400) {
      throw new Error(`Failed to ${method} ${url}: ${resp.status} ${resp.statusText} ${await resp.text()}`);
    }

    return resp;
  }
}
