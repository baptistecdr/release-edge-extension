import fs from "node:fs";
import * as core from "@actions/core";
import { EWSClient } from "./ews";

async function run(): Promise<void> {
  const apiKey = core.getInput("api-key", { required: true });
  const clientId = core.getInput("client-id", { required: true });
  const productId = core.getInput("product-id", { required: true });
  const productPath = core.getInput("product-path", { required: true });
  const publishNotes = core.getInput("publish-notes");
  const retryLimit = Number.parseInt(core.getInput("retry-limit"), 10) || 10;
  const retryAfterPeriod = Number.parseInt(core.getInput("retry-after-period"), 10) || 5;

  const client = new EWSClient({ apiKey, clientId });
  const zip = await fs.openAsBlob(productPath);

  const uploadOperationId = await client.uploadPackage(productId, zip);
  core.info(`Upload package result: ${uploadOperationId}`);
  const uploadStatus = await client.checkUploadStatus(productId, uploadOperationId, retryLimit, retryAfterPeriod);
  core.info(`Upload package status: ${uploadStatus}`);

  const publishOperationId = await client.publishSubmission(productId, publishNotes);
  const publishStatus = await client.checkPublishStatus(productId, publishOperationId, retryLimit, retryAfterPeriod);
  core.info(`Final Publish Status: ${publishStatus}`);
}

try {
  await run();
} catch (error) {
  core.setFailed(String(error));
}
