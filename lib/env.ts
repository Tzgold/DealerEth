export function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is missing from environment variables.`);
  }

  return value;
}

export function getOptionalEnv(name: string) {
  return process.env[name]?.trim() || undefined;
}

export function getAppUrl() {
  return getOptionalEnv("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000";
}
