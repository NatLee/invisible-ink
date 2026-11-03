import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// The same rule set as the old .eslintrc.json ("next/core-web-vitals"), in the flat
// config format ESLint 9 uses. It already ignores .next/, out/, build/ and next-env.d.ts.
export default defineConfig([...nextCoreWebVitals]);
