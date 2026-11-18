import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface PetDetailContextValue {
  isEditOpen: boolean;
  openEditDialog: () => void;
  setIsEditOpen: (open: boolean) => void;
}

const PetDetailContext = createContext<PetDetailContextValue | null>(null);

export function PetDetailProvider({ children }: { children: ReactNode }) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const openEditDialog = useCallback(() => {
    setIsEditOpen(true);
  }, []);

  const value = useMemo<PetDetailContextValue>(
    () => ({
      isEditOpen,
      openEditDialog,
      setIsEditOpen,
    }),
    [isEditOpen, openEditDialog]
  );

  return <PetDetailContext.Provider value={value}>{children}</PetDetailContext.Provider>;
}

export function usePetDetailContext(): PetDetailContextValue {
  const context = useContext(PetDetailContext);
  if (!context) {
    throw new Error("usePetDetailContext must be used within a PetDetailProvider");
  }
  return context;
}
