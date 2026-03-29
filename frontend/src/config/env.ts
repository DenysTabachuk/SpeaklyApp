function requireFrontendEnv(name: "VITE_API_BASE_URL" | "VITE_BACKEND_ASSET_URL") {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const apiBaseUrl = requireFrontendEnv("VITE_API_BASE_URL");
const backendAssetUrl = requireFrontendEnv("VITE_BACKEND_ASSET_URL");

export const frontendEnv = {
  apiBaseUrl,
  backendAssetUrl,
};

export function buildBackendAssetUrl(assetPath?: string | null) {
  if (!assetPath) {
    return null;
  }

  return `${frontendEnv.backendAssetUrl}${assetPath}`;
}
