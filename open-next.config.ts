import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";

export default defineCloudflareConfig({
  // ১. R2-এ ডাটাবেস ক্যাশিং স্টোর করা (এটি সবচেয়ে সাশ্রয়ী এবং স্কেলেবল)
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: "long-lived", // হাই-ট্রাফিক সাইটের জন্য বেস্ট
    bypassTagCacheOnCacheHit: true, // রেসপন্স টাইম আরও ফাস্ট করার জন্য
  }),
  
  // ২. পেমেন্ট রিকোয়েস্ট বা কুইজ আপডেটের জন্য Queueing
  queue: doQueue,
  
  // ৩. On-demand revalidation (কুইজ আপডেট বা লিডারবোর্ড আপডেটের জন্য)
  tagCache: d1NextTagCache,
  
  // ৪. কোল্ড স্টার্ট পারফরম্যান্সের জন্য Cache Interception এনাবল করা
  enableCacheInterception: true,
});
