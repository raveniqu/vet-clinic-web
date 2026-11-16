import { cn } from "cn";
import { ImagePlus, PawPrint, QrCode, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "#/client/shared/shadcn/components/ui/avatar";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { Field, FieldContent } from "#/client/shared/shadcn/components/ui/field";
import { Input } from "#/client/shared/shadcn/components/ui/input";
import {
  AppFieldDescription,
  AppFieldError,
  AppFieldLabel,
  AppFieldLegend,
  AppFieldSet,
} from "#/client/shared/components/app-field";
import { usePetProfile } from "#/client/features/reception/pets/hooks/use-pet-profile";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";

export function PetIdentityProfileField() {
  const {
    // Pet Name
    petName,
    petNameError,
    handlePetNameChange,

    // Photo Upload
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
    openQrModal,
  } = usePetProfile();

  const isMobile = useIsMobile();

  return (
    <AppFieldSet>
      <AppFieldLegend>
        <PawPrint className="size-4 text-primary" />
        <span>Profile</span>
      </AppFieldLegend>
      <FieldContent className="gap-y-6">
        {/* Pet Photo Uploader */}
        <Field>
          <AppFieldLabel htmlFor="pet-photo-upload">Pet Photo (Optional)</AppFieldLabel>
          <Input
            ref={fileInputRef}
            id="pet-photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            tabIndex={-1}
          />

          <section
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onPaste={handlePaste}
            aria-label="Pet photo upload dropzone and clipboard paste area"
            className={cn(
              "flex items-center gap-4 rounded-2xl bg-card transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:flex-row",
              { "bg-primary/5": isDragging }
            )}
          >
            <div className="relative">
              <Avatar
                className="size-24 cursor-pointer shadow-sm md:size-28"
                onClick={handleClickUpload}
              >
                {photo ? (
                  <AvatarImage src={photo} alt="Pet Profile" className="object-cover" />
                ) : null}
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <ImagePlus className="size-8" />
                </AvatarFallback>
              </Avatar>
              {photo && (
                <div className="absolute -right-1 -bottom-1 flex w-full items-center justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={handleRemovePhoto}
                    aria-label="Remove Photo"
                  >
                    <Trash2 />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                size={isMobile ? "xs" : "sm"}
                onClick={openQrModal}
                className="hidden w-fit md:inline-flex"
              >
                <QrCode className="text-primary" />
                <span>Scan with Phone</span>
              </Button>
              <AppFieldDescription className="flex flex-col items-center gap-1 md:items-start">
                <span>Support JPG, PNG or WebP up to 5MB.</span>
                <span className="hidden md:block">
                  You can also paste directly with{" "}
                  <kbd className="rounded-sm bg-secondary px-1 py-0.5 text-[10px]">Ctrl+V</kbd> from
                  LINE PC or clipboard.
                </span>
              </AppFieldDescription>
              {uploadError && <AppFieldError>{uploadError}</AppFieldError>}
            </div>
          </section>
        </Field>

        {/* Pet Name */}
        <Field data-invalid={!!petNameError}>
          <AppFieldLabel htmlFor="pet-name">
            <span>Pet Name</span>
            <span className="font-bold text-destructive">*</span>
          </AppFieldLabel>
          <Input
            id="pet-name"
            value={petName}
            onChange={handlePetNameChange}
            placeholder="e.g., Lucky, Mochi, Milo"
            className="placeholder:text-sm"
            aria-invalid={!!petNameError}
          />
          {petNameError && <AppFieldError>{petNameError}</AppFieldError>}
        </Field>
      </FieldContent>
    </AppFieldSet>
  );
}
