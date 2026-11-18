import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import type { PetDto } from "#/shared/schemas/pet.schema";

interface PetRowContextValue {
  pet: PetDto;
  columnId?: string;
  speciesCode?: string;
  isMicrochipCopied: boolean;
  copyMicrochip: (petId: string, value: string) => void;
}

const PetRowContext = createContext<PetRowContextValue | null>(null);

interface PetRowProviderProps {
  pet: PetDto;
  columnId?: string;
  speciesCode?: string;
  isMicrochipCopied?: boolean;
  onCopyMicrochip?: (petId: string, value: string) => void;
  children: ReactNode;
}

const noopCopyMicrochip = (_petId: string, _value: string) => {};

export function PetRowProvider({
  pet,
  columnId,
  speciesCode,
  isMicrochipCopied = false,
  onCopyMicrochip = noopCopyMicrochip,
  children,
}: PetRowProviderProps) {
  const value = useMemo<PetRowContextValue>(
    () => ({
      pet,
      columnId,
      speciesCode,
      isMicrochipCopied,
      copyMicrochip: onCopyMicrochip,
    }),
    [pet, columnId, speciesCode, isMicrochipCopied, onCopyMicrochip]
  );

  return <PetRowContext.Provider value={value}>{children}</PetRowContext.Provider>;
}

export function usePetRowContext(): PetRowContextValue {
  const context = useContext(PetRowContext);
  if (!context) {
    throw new Error("usePetRowContext must be used within a PetRowProvider");
  }
  return context;
}
