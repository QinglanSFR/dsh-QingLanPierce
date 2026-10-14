import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export const LEGAL_FILE = "legal/DISCLAIMER.txt";

export const LEGAL_MAX_BYTES = 64 * 1024;

let cache = { key: "", value: null };

export function legalHash(text) {
  let hash = 5381;
  const body = typeof text === "string" ? text : "";
  for (let i = 0; i < body.length; i += 1) hash = ((hash * 33) ^ body.charCodeAt(i)) >>> 0;
  return `${body.length.toString(36)}-${hash.toString(36)}`;
}

function versionOf(text) {
  const match = /协议版本\s*([\w.\-]+)/u.exec(String(text || ""));
  return match ? match[1] : "unknown";
}

export function loadLegal(pluginRoot, options = {}) {
  const path = join(pluginRoot, LEGAL_FILE);
  const fresh = options.fresh === true;
  const fallback = { version: "unknown", hash: "", text: "", path, error: "" };
  try {
    if (!existsSync(path)) return { ...fallback, error: "协议文件缺失" };
    const stat = statSync(path);
    const key = `${stat.mtimeMs}:${stat.size}`;
    if (!fresh && cache.value && cache.key === key) return cache.value;
    const text = readFileSync(path, "utf8");
    if (!text.trim()) return { ...fallback, error: "协议文件为空" };
    if (Buffer.byteLength(text, "utf8") > LEGAL_MAX_BYTES) return { ...fallback, error: "协议文件过大" };
    const value = { version: versionOf(text), hash: legalHash(text), text, path, error: "" };
    cache = { key, value };
    return value;
  } catch (error) {
    return { ...fallback, error: String(error?.message || error) };
  }
}
