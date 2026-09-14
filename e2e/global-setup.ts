import { rm } from "node:fs/promises";
import path from "node:path";

export default async function globalSetup() {
  await rm(path.join(process.cwd(), ".data/e2e.json"), { force: true });
}
