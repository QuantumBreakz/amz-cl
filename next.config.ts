import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * The app ships no security headers by default, so a deployed instance is
 * framable and has no CSP. Nothing here loads third-party scripts or styles,
 * so the policy can be tight: self only, plus the inline styles/scripts Next
 * emits for hydration.
 */
const baseHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/**
 * CSP is applied in production only. Next's dev server needs eval() for React's
 * debugging tooling and a websocket for HMR, and loosening the policy enough to
 * permit both would weaken the very thing being tested. Production is what gets
 * deployed and what the policy is written for.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // Next injects inline bootstrap scripts and styles during hydration.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = isDev
  ? baseHeaders
  : [...baseHeaders, { key: "Content-Security-Policy", value: contentSecurityPolicy }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
