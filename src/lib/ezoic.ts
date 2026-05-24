export const runEzoic = (cb: () => void) => {
  if (typeof window === 'undefined') return;
  window.ezstandalone = window.ezstandalone || {};
  window.ezstandalone.cmd = window.ezstandalone.cmd || [];
  window.ezstandalone.cmd.push(cb);
};

/**
 * Request and show a Rewarded Ad. 
 * Resolves to `true` if the ad was watched entirely, `false` otherwise.
 */
export const showRewardedAd = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);

    const rewardedApi = window.ezoic?.rewarded;
    
    if (rewardedApi && typeof rewardedApi.requestAndShow === 'function') {
      rewardedApi.requestAndShow((rewardGranted: boolean) => {
        resolve(rewardGranted);
      });
    } else {
      console.warn("Ezoic Rewarded Ads API not loaded. Failing open for MVP.");
      // Fail open (grant reward) for local testing or ad-blocked users.
      resolve(true); 
    }
  });
};
