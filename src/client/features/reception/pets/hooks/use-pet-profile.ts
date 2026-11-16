import type { ChangeEvent, ClipboardEvent, DragEvent } from "react";
import { useCallback, useRef, useState } from "react";
import { useAddNewPetFormContext } from "#/client/features/reception/pets/contexts/add-new-pet-form-provider";
import { useFormFieldError, useFormValues } from "#/client/shared/hooks/use-wizard-form";

const DEMO_PHOTO_AVATAR =
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80";

const PET_PROFILE_KEYS = ["petName", "photo"] as const;

export function usePetProfile() {
  const { form, setFieldValue, isQrModalOpen, setIsQrModalOpen } = useAddNewPetFormContext();
  const { petName, photo } = useFormValues(form, PET_PROFILE_KEYS);
  const petNameError = useFormFieldError(form, "petName");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setUploadError(null);
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select a valid image file (JPG, PNG, WebP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image size exceeds 5MB limit");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setFieldValue("photo", result);
        }
      };
      reader.readAsDataURL(file);
    },
    [setFieldValue]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files.item(0);
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLElement>) => {
      const items = e.clipboardData.items;
      for (const item of Array.from(items)) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            processFile(file);
            e.preventDefault();
            break;
          }
        }
      }
    },
    [processFile]
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

  const openQrModal = useCallback(() => {
    setIsQrModalOpen(true);
  }, [setIsQrModalOpen]);

  const closeQrModal = useCallback(() => {
    setIsQrModalOpen(false);
  }, [setIsQrModalOpen]);

  const handleSimulateMobileUpload = useCallback(() => {
    setFieldValue("photo", DEMO_PHOTO_AVATAR);
    setIsQrModalOpen(false);
  }, [setFieldValue, setIsQrModalOpen]);

  const handlePetNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFieldValue("petName", e.target.value);
    },
    [setFieldValue]
  );

  return {
    // Pet Name
    petName,
    petNameError,
    handlePetNameChange,

    // Photo Upload & QR Modal
    photo,
    fileInputRef,
    isDragging,
    uploadError,
    isQrModalOpen,
    setIsQrModalOpen,
    openQrModal,
    closeQrModal,
    handleSimulateMobileUpload,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handlePaste,
    handleRemovePhoto,
    handleClickUpload,
  };
}
