export type TikTokUserInfo = {
  openId: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  followerCount?: number;
};

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing.`);
  }

  return value;
}

export function getTikTokAuthConfig() {
  return {
    clientKey: requiredEnv("TIKTOK_CLIENT_KEY"),
    clientSecret: requiredEnv("TIKTOK_CLIENT_SECRET"),
    redirectUri: requiredEnv("TIKTOK_REDIRECT_URI"),
  };
}

export async function exchangeTikTokCode(code: string) {
  const { clientKey, clientSecret, redirectUri } = getTikTokAuthConfig();
  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  const response = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error("TikTok token exchange failed.");
  }

  const data = (await response.json()) as {
    access_token?: string;
    open_id?: string;
    error?: string;
  };

  if (!data.access_token) {
    throw new Error(data.error ?? "TikTok access token missing.");
  }

  return {
    accessToken: data.access_token,
    openId: data.open_id,
  };
}

export async function fetchTikTokUserInfo(accessToken: string): Promise<TikTokUserInfo> {
  const response = await fetch(
    "https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,username,avatar_url,follower_count",
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch TikTok user info.");
  }

  const data = (await response.json()) as {
    data?: {
      user?: {
        open_id?: string;
        username?: string;
        display_name?: string;
        avatar_url?: string;
        follower_count?: number;
      };
    };
  };

  const user = data.data?.user;
  if (!user?.open_id) {
    throw new Error("TikTok user info missing open_id.");
  }

  return {
    openId: user.open_id,
    username: user.username,
    displayName: user.display_name,
    avatarUrl: user.avatar_url,
    followerCount: typeof user.follower_count === "number" ? user.follower_count : undefined,
  };
}
