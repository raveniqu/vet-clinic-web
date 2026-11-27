import { cn } from "cn";
import { ImagePlus, PawPrint, Trash2 } from "lucide-react";
import { usePetProfile } from "#/client/features/pets/hooks/use-pet-profile";
import {
	AppFieldDescription,
	AppFieldError,
	AppFieldLabel,
	AppFieldLegend,
	AppFieldSet,
} from "#/client/shared/components/app-field";
import { AppInput } from "#/client/shared/components/app-input-group";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "#/client/shared/shadcn/components/ui/avatar";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
	Field,
	FieldContent,
} from "#/client/shared/shadcn/components/ui/field";
import { Input } from "#/client/shared/shadcn/components/ui/input";

export function PetProfileField() {
	const {
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
	} = usePetProfile();

	return (
		<AppFieldSet>
			<AppFieldLegend>
				<PawPrint aria-hidden="true" />
				<span>โปรไฟล์สัตว์เลี้ยง</span>
			</AppFieldLegend>
			<FieldContent className="gap-y-6">
				<Field>
					<AppFieldLabel htmlFor="pet-photo-upload">
						รูปภาพสัตว์เลี้ยง (ไม่บังคับ)
					</AppFieldLabel>
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
						aria-label="พื้นที่อัปโหลดหรือวางรูปภาพสัตว์เลี้ยงจากคลิปบอร์ด"
						className={cn(
							"flex items-center gap-4 rounded-2xl bg-card transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:flex-row",
							{ "bg-primary/5": isDragging },
						)}
					>
						<div className="relative">
							<Avatar
								className="size-24 cursor-pointer shadow-sm md:size-28"
								onClick={handleClickUpload}
							>
								{photo ? (
									<AvatarImage
										src={photo}
										alt="รูปโปรไฟล์สัตว์เลี้ยง"
										className="object-cover"
									/>
								) : null}
								<AvatarFallback className="bg-muted text-muted-foreground">
									<ImagePlus className="size-8" aria-hidden="true" />
								</AvatarFallback>
							</Avatar>
							{photo ? (
								<div className="absolute -right-1 -bottom-1 flex w-full items-center justify-end">
									<Button
										type="button"
										variant="destructive"
										size="icon-sm"
										onClick={handleRemovePhoto}
										aria-label="ลบรูปภาพ"
									>
										<Trash2 aria-hidden="true" />
									</Button>
								</div>
							) : null}
						</div>
						<div className="flex flex-col gap-2">
							<Button
								type="button"
								variant="outline"
								size="xs"
								onClick={handleClickUpload}
								className="w-fit"
							>
								<ImagePlus className="size-3.5" aria-hidden="true" />
								<span>เลือกรูปภาพ</span>
							</Button>
							<AppFieldDescription className="flex flex-col items-start gap-1">
								<span>รองรับไฟล์ JPG, PNG หรือ WebP ขนาดไม่เกิน 5MB</span>
								<span className="hidden md:block">
									หรือลากไฟล์มาวาง / กดวางภาพโดยตรงด้วย{" "}
									<kbd className="rounded-sm bg-secondary px-1 py-0.5 text-[10px]">
										Ctrl+V
									</kbd>{" "}
									จาก LINE PC หรือคลิปบอร์ด
								</span>
							</AppFieldDescription>
							{uploadError ? (
								<AppFieldError>{uploadError}</AppFieldError>
							) : null}
						</div>
					</section>
				</Field>

				<Field data-invalid={Boolean(petNameError)}>
					<AppFieldLabel htmlFor="pet-name">
						<span>ชื่อสัตว์เลี้ยง</span>
						<span className="font-bold text-destructive">*</span>
					</AppFieldLabel>
					<AppInput
						id="pet-name"
						value={petName}
						onChange={handlePetNameChange}
						placeholder="เช่น ลัคกี้, โมจิ, ไมโล"
						className="placeholder:text-sm"
						aria-invalid={Boolean(petNameError)}
					/>
					{petNameError ? <AppFieldError>{petNameError}</AppFieldError> : null}
				</Field>
			</FieldContent>
		</AppFieldSet>
	);
}
