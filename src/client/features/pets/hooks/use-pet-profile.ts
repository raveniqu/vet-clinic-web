import type { ChangeEvent, ClipboardEvent, DragEvent } from "react";
import { useCallback, useRef, useState } from "react";
import {
	useFormFieldError,
	useFormValues,
} from "#/client/shared/hooks/use-wizard-form";
import { usePetFormContext } from "../contexts/pet-form.context";

const PET_PROFILE_KEYS = ["petName", "photo"] as const;

export function usePetProfile() {
	const { form, setFieldValue } = usePetFormContext();
	const { petName, photo } = useFormValues(form, PET_PROFILE_KEYS);
	const petNameError = useFormFieldError(form, "petName");

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const processFile = useCallback(
		(file: File) => {
			setUploadError(null);
			if (!file.type.startsWith("image/")) {
				setUploadError("กรุณาเลือกไฟล์รูปภาพที่รองรับ (JPG, PNG หรือ WebP)");
				return;
			}

			if (file.size > 5 * 1024 * 1024) {
				setUploadError("ขนาดไฟล์รูปภาพต้องไม่เกิน 5MB");
				return;
			}

			const reader = new FileReader();
			reader.onload = (event) => {
				const result = event.target?.result;
				if (typeof result === "string") {
					setFieldValue("photo", result);
				}
			};
			reader.readAsDataURL(file);
		},
		[setFieldValue],
	);

	const handleFileChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file) {
				processFile(file);
			}
		},
		[processFile],
	);

	const handleDragOver = useCallback((event: DragEvent<HTMLElement>) => {
		event.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((event: DragEvent<HTMLElement>) => {
		event.preventDefault();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(event: DragEvent<HTMLElement>) => {
			event.preventDefault();
			setIsDragging(false);
			const file = event.dataTransfer.files.item(0);
			if (file) {
				processFile(file);
			}
		},
		[processFile],
	);

	const handlePaste = useCallback(
		(event: ClipboardEvent<HTMLElement>) => {
			const items = event.clipboardData.items;
			for (const item of Array.from(items)) {
				if (item.type.includes("image")) {
					const file = item.getAsFile();
					if (file) {
						processFile(file);
						event.preventDefault();
						break;
					}
				}
			}
		},
		[processFile],
	);

	const handleRemovePhoto = useCallback(() => {
		setFieldValue("photo", "");
		setUploadError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [setFieldValue]);

	const handleClickUpload = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handlePetNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFieldValue("petName", event.target.value);
		},
		[setFieldValue],
	);

	return {
		petName,
		petNameError,
		handlePetNameChange,
		photo,
		fileInputRef,
		isDragging,
		uploadError,
		handleFileChange,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handlePaste,
		handleRemovePhoto,
		handleClickUpload,
	};
}
