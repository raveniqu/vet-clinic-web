import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { OwnerDto } from "#/shared/schemas/owner.schema";

const OwnerRowContext = createContext<OwnerDto | null>(null);

export function OwnerRowProvider({ owner, children }: { owner: OwnerDto; children: ReactNode }) {
  return <OwnerRowContext.Provider value={owner}>{children}</OwnerRowContext.Provider>;
}

export function useOwnerRow(): OwnerDto {
  const owner = useContext(OwnerRowContext);
  if (!owner) {
    throw new Error("useOwnerRow must be used inside <OwnerRowProvider>");
  }
  return owner;
}
