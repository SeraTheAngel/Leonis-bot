const invitePattern = /(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discord(?:app)?\.com\/invite)\/[A-Za-z0-9-]+/i;
const urlPattern = /https?:\/\/\S+/i;

export function isBlockedInvite(content) {
  return invitePattern.test(content);
}

export function hasUrl(content) {
  return urlPattern.test(content);
}

export function isRaidMessage(content) {
  return /@everyone|@here/i.test(content) || isBlockedInvite(content);
}
