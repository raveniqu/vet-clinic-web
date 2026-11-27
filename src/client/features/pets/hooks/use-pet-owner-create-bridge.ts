import { useEffect, useRef } from "react";
import { useOwnerFormContext } from "#/client/features/owners/contexts/owner-form.context";
import { usePetFormContext } from "../contexts/pet-form.context";

export function usePetOwnerCreateBridge() {
	const { isNewOwnerModalOpen, setIsNewOwnerModalOpen } = usePetFormContext();
	const { isOpen, openCreate } = useOwnerFormContext();

	const prevTriggerOpenRef = useRef(false);
	const prevOwnerFormOpenRef = useRef(false);

	useEffect(() => {
		if (isNewOwnerModalOpen && !prevTriggerOpenRef.current) {
			openCreate();
		}
		prevTriggerOpenRef.current = isNewOwnerModalOpen;
	}, [isNewOwnerModalOpen, openCreate]);

	useEffect(() => {
		if (prevOwnerFormOpenRef.current && !isOpen && isNewOwnerModalOpen) {
			setIsNewOwnerModalOpen(false);
		}
		prevOwnerFormOpenRef.current = isOpen;
	}, [isOpen, isNewOwnerModalOpen, setIsNewOwnerModalOpen]);
}
