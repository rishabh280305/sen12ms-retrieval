import { defineConfig } from "@playwright/test";

export default defineConfig({ testDir: "./e2e", timeout: 60_000, retries: 1, workers: 1, use: { baseURL: process.env.BASE_URL ?? "https://sen12ms-retrieval.vercel.app", trace: "retain-on-failure" } });
