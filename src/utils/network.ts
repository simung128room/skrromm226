export interface NetworkStatus {
  internetReachable: boolean;
  backendReachable: boolean;
}

export const checkNetworkStatus = async (): Promise<NetworkStatus> => {
  if (!navigator.onLine) {
    return { internetReachable: false, backendReachable: false };
  }

  let internetReachable = false;
  let backendReachable = false;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

  try {
    // 1. Check Internet Reachability
    // We use a high-availability public endpoint
    const traceRes = await fetch("https://1.1.1.1/cdn-cgi/trace", {
      method: "GET",
      cache: "no-store",
      mode: "no-cors",
      signal: controller.signal,
    });
    // no-cors fetch will be opaque but won't throw if successful
    internetReachable = true;

    // 2. Check Backend Reachability
    // In a real app we hit our own /api/health endpoint. Here we'll simulate a backend ping.
    // We'll assume the backend is reachable if the internet is, though in a real scenario this
    // would be a fetch to our specific API domain.
    // Simulating a backend health check:
    backendReachable = true;
  } catch (err) {
    if (controller.signal.aborted) {
      console.warn("Network health check timed out");
    }
  } finally {
    clearTimeout(timeoutId);
  }

  return { internetReachable, backendReachable };
};

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
