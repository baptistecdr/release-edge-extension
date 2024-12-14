import fs from "node:fs";
import * as core from "@actions/core";
import { EWSClient } from "./ews";

async function run(): Promise<void> {
  const apiKey = core.getInput("api-key");
  const clientId = core.getInput("client-id");
  const productId = core.getInput("product-id");
  const productPath = core.getInput("product-path");

  const client = new EWSClient({ apiKey, clientId });
  const zip = await fs.openAsBlob(productPath);
  const updateResult = await client.updateItem(productId, zip);
  core.info(`Update product result: ${updateResult}`);

  const publishResult = await client.publishItem(productId);
  core.info(`Publish product result: ${publishResult}`);

  core.info("Edge Extension published!");
}

try {
  await run();
} catch (error) {
  core.setFailed(String(error));
}
