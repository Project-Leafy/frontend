import { clsx } from "https://cdn.jsdelivr.net/npm/clsx@2.1.0/dist/clsx.mjs";
import { twMerge } from "https://cdn.jsdelivr.net/npm/tailwind-merge@2.3.0/dist/tw-merge.mjs";

// React 없어도 완전히 동일하게 사용 가능
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
