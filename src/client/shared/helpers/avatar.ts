export function getAvatarUrl(userId: string | number) {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(String(userId))}`;
}
