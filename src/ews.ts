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

  public async uploadPackage(productId: string, zip: Blob): Promise<string> {
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
    throw new Error(`Failed to upload package: ${response.status} ${response.statusText}`);
  }

  public async checkUploadStatus(productId: string, operationId: string, retryLimit: number, retryAfterPeriod: number): Promise<string> {
    let retryCount = 1;
    let uploadStatus = "InProgress";

    while (uploadStatus === "InProgress") {
      if (retryCount > retryLimit) {
        throw new Error("Retry limit exceeded");
      }

      const response = await this.proceed("GET", `/${productId}/submissions/draft/package/operations/${operationId}`);
      const content = await response.json();
      uploadStatus = content.status;

      if (uploadStatus === "InProgress") {
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, retryAfterPeriod * 1000));
      }
    }

    return uploadStatus;
  }

  public async publishSubmission(productId: string, publishNotes?: string): Promise<string> {
    const body = publishNotes ? JSON.stringify({ notes: publishNotes }) : undefined;
    const response = await this.proceed("POST", `/${productId}/submissions`, { "Content-Type": "application/json" }, body);

    if (response.status === 202) {
      if (!response.headers.has("Location")) {
        throw new Error("operationID not found");
      }
      return response.headers.get("Location") as string;
    }
    throw new Error(`Failed to publish submission: ${response.status} ${response.statusText}`);
  }

  public async checkPublishStatus(productId: string, operationId: string, retryLimit: number, retryAfterPeriod: number): Promise<string> {
    let retryCount = 1;
    let publishStatus = "InProgress";

    while (publishStatus === "InProgress") {
      if (retryCount > retryLimit) {
        throw new Error("Retry limit exceeded");
      }

      const response = await this.proceed("GET", `/${productId}/submissions/operations/${operationId}`);
      const content = await response.json();
      publishStatus = content.status;

      if (publishStatus === "InProgress") {
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, retryAfterPeriod * 1000));
      }
    }

    return publishStatus;
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
