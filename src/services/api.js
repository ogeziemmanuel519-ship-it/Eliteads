import { CONFIG } from '../config';

// All calls assume a bearer token auth scheme — swap for your actual auth.
async function request(path, options = {}, token) {
  const res = await fetch(`${CONFIG.API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json();
}

// Fetches the user's current point balance + today's ad count from the server.
// IMPORTANT: never trust a client-side point count for payouts — always
// resync from the server before showing balance or allowing redemption.
export function fetchUserStatus(token) {
  return request('/user/status', { method: 'GET' }, token);
}

// Reports a completed rewarded ad view to the server so it can credit
// points server-side. The server is the source of truth for the 15/day cap.
export function reportAdCompleted(token, { adNetwork, adUnitId }) {
  return request(
    '/ads/completed',
    {
      method: 'POST',
      body: JSON.stringify({ adNetwork, adUnitId, timestamp: Date.now() }),
    },
    token
  );
}

// Requests a payout via Chaingateway (USDT-TRC20). Server should validate
// minimum balance, wallet address format, and any KYC/anti-fraud checks
// before calling Chaingateway itself — do not call Chaingateway from the client.
export function requestPayout(token, { walletAddress, pointsAmount }) {
  return request(
    '/payout/request',
    {
      method: 'POST',
      body: JSON.stringify({ walletAddress, pointsAmount }),
    },
    token
  );
}

// Returns a list of past activity: ad completions + payout requests.
// Expected shape: [{ id, type: 'ad'|'payout', points, status, createdAt }]
export function fetchHistory(token) {
  return request('/user/history', { method: 'GET' }, token);
}

// Returns the user's referral code/link and stats.
// Expected shape: { code, link, referredCount, pointsEarnedFromReferrals }
export function fetchReferralInfo(token) {
  return request('/referral/info', { method: 'GET' }, token);
}

// Updates user settings (e.g. notification preferences).
export function updateSettings(token, settings) {
  return request(
    '/user/settings',
    { method: 'POST', body: JSON.stringify(settings) },
    token
  );
}
