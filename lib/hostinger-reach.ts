const HOSTINGER_API_BASE_URL = "https://developers.hostinger.com";

type ReachContactPayload = {
  email: string;
  name?: string;
  surname?: string;
  note?: string;
};

type ReachProfileResource = {
  uuid?: string;
  name?: string;
  title?: string;
  description?: string;
};

type ReachGroupResource = {
  uuid?: string;
  title?: string;
};

function getReachHeaders() {
  const apiToken = process.env.HOSTINGER_API_TOKEN;

  if (!apiToken) {
    return null;
  }

  return {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  };
}

async function fetchReachJson<T>(endpoint: string) {
  const headers = getReachHeaders();

  if (!headers) {
    return {
      success: false as const,
      skipped: true as const,
      error: "HOSTINGER_API_TOKEN is not configured",
    };
  }

  const response = await fetch(`${HOSTINGER_API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = `Hostinger Reach request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as {
        error?: string;
        message?: string;
      };

      errorMessage = errorBody.error || errorBody.message || errorMessage;
    } catch {
      // Keep fallback message.
    }

    return {
      success: false as const,
      skipped: false as const,
      error: errorMessage,
    };
  }

  const data = (await response.json()) as T;

  return {
    success: true as const,
    skipped: false as const,
    data,
  };
}

async function createReachContact(endpoint: string, payload: ReachContactPayload) {
  const headers = getReachHeaders();

  if (!headers) {
    return { success: false, skipped: true, error: "HOSTINGER_API_TOKEN is not configured" };
  }

  const response = await fetch(`${HOSTINGER_API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (response.ok) {
    return { success: true, skipped: false };
  }

  let errorMessage = "Failed to sync contact to Hostinger Reach";

  try {
    const errorBody = (await response.json()) as {
      error?: string;
      message?: string;
      errors?: Array<{ message?: string }>;
    };

    errorMessage =
      errorBody.error ||
      errorBody.message ||
      errorBody.errors?.[0]?.message ||
      errorMessage;
  } catch {
    // Ignore JSON parsing issues and use fallback message.
  }

  const normalized = errorMessage.toLowerCase();
  const isDuplicate = response.status === 422 && normalized.includes("exist");

  if (isDuplicate) {
    return { success: true, skipped: false, duplicate: true };
  }

  return { success: false, skipped: false, error: errorMessage };
}

export async function syncMakerDigestContact(email: string) {
  const payload: ReachContactPayload = {
    email,
    note: "Maker Digest signup from BuildDeck website",
  };

  const profileUuid = process.env.HOSTINGER_REACH_PROFILE_UUID;

  if (profileUuid) {
    return createReachContact(`/api/reach/v1/profiles/${profileUuid}/contacts`, payload);
  }

  return createReachContact("/api/reach/v1/contacts", payload);
}

export function isReachWelcomeManaged() {
  return process.env.HOSTINGER_REACH_WELCOME_MANAGED === "true";
}

export async function listReachProfiles() {
  return fetchReachJson<Array<ReachProfileResource> | { data?: Array<ReachProfileResource> }>(
    "/api/reach/v1/profiles"
  );
}

export async function listReachContactGroups() {
  return fetchReachJson<Array<ReachGroupResource> | { data?: Array<ReachGroupResource> }>(
    "/api/reach/v1/contacts/groups"
  );
}

function normalizeCollection<T extends { uuid?: string }>(input: Array<T> | { data?: Array<T> } | undefined) {
  if (!input) {
    return [] as Array<T>;
  }

  return Array.isArray(input) ? input : input.data || [];
}

function normalizeProfilesCollection(
  input:
    | Array<ReachProfileResource>
    | { data?: Array<ReachProfileResource> }
    | Array<{ profiles?: Array<ReachProfileResource> }>
    | undefined
) {
  if (!input) {
    return [] as Array<ReachProfileResource>;
  }

  if (Array.isArray(input)) {
    // Reach can return an array of subscription resources that each include `profiles`.
    if (input.length > 0 && "profiles" in (input[0] as object)) {
      return (input as Array<{ profiles?: Array<ReachProfileResource> }>).flatMap(
        (item) => item.profiles || []
      );
    }

    return input as Array<ReachProfileResource>;
  }

  return input.data || [];
}

export async function getReachDebugSnapshot() {
  const profileUuid = process.env.HOSTINGER_REACH_PROFILE_UUID;
  const tokenConfigured = Boolean(process.env.HOSTINGER_API_TOKEN);

  const [profilesResult, groupsResult] = tokenConfigured
    ? await Promise.all([listReachProfiles(), listReachContactGroups()])
    : [
        { success: false as const, skipped: true as const, error: "HOSTINGER_API_TOKEN is not configured" },
        { success: false as const, skipped: true as const, error: "HOSTINGER_API_TOKEN is not configured" },
      ];

  return {
    tokenConfigured,
    profileUuid: profileUuid || null,
    welcomeManaged: isReachWelcomeManaged(),
    profiles: profilesResult.success ? normalizeProfilesCollection(profilesResult.data) : [],
    groups: groupsResult.success ? normalizeCollection(groupsResult.data) : [],
    profilesError: profilesResult.success ? null : profilesResult.error,
    groupsError: groupsResult.success ? null : groupsResult.error,
  };
}