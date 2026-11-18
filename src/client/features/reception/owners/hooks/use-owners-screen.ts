import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";

export function useOwnersScreen() {
  const isMobile = useIsMobile();

  return {
    isMobile,
  };
}
