#!/usr/bin/env node
/** Verify the repository-side requirements of the 8x capture rubric. */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const settingsPath = path.join(root, ".claude", "settings.json");
const logsDir = path.join(root, ".agent-logs");
const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));

const commandFor = (event) => settings?.hooks?.[event]?.flatMap((group) => group.hooks ?? [])
  .find((hook) => hook.type === "command")?.command;
if (commandFor("UserPromptSubmit") !== "python3 .claude/capture.py prompt") {
  throw new Error("UserPromptSubmit capture hook is missing or changed");
}
if (commandFor("Stop") !== "python3 .claude/capture.py response") {
  throw new Error("Stop capture hook is missing or changed");
}

const markdownLogs = fs.readdirSync(logsDir)
  .filter((name) => name.endsWith(".md"))
  .map((name) => path.join(logsDir, name));
const canaries = ["capture retry one confirmed.", "capture retry two confirmed."];
for (const response of canaries) {
  const found = markdownLogs.some((file) => fs.readFileSync(file, "utf8").includes(response));
  if (!found) throw new Error(`Missing automatic canary response: ${response}`);
}
const canaryPrompts = markdownLogs.reduce((count, file) => {
  const text = fs.readFileSync(file, "utf8");
  return count + (text.includes("CAPTURE TEST — 8x assignment, Ali Ahmed — retry session one") ? 1 : 0)
    + (text.includes("CAPTURE TEST — 8x assignment, Ali Ahmed — retry session two") ? 1 : 0);
}, 0);
if (canaryPrompts < 2) throw new Error("Missing the two-session canary prompts");

console.log(`capture verification passed: ${markdownLogs.length} markdown logs, two canary sessions, both lifecycle hooks wired`);
