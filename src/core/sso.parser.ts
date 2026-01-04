// src/auth/sso.parser.ts
import * as cheerio from "cheerio";

export function parseExecution(html: string): string {
  const $ = cheerio.load(html);
  const value = $('input[name="execution"]').val();

  if (!value || typeof value !== "string") {
    throw new Error("execution not found");
  }

  return value;
}
