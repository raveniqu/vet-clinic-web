import { cn } from "cn";
import {
	ArrowLeft,
	Cat,
	ChevronsUpDown,
	Dna,
	Dog,
	Plus,
	Search,
} from "lucide-react";
import { usePetSpeciesBreed } from "#/client/features/pets/hooks/use-pet-species-breed";
import {
	AppFieldDescription,
	AppFieldError,
	AppFieldLabel,
	AppFieldLegend,
	AppFieldSet,
	AppFieldTitle,
} from "#/client/shared/components/app-field";
import {
	AppInput,
	AppInputGroup,
	AppInputGroupInput,
} from "#/client/shared/components/app-input-group";
import { AppSpeciesIcon } from "#/client/shared/components/app-species-icon";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/client/shared/shadcn/components/ui/dropdown-menu";
import {
	Field,
	FieldContent,
} from "#/client/shared/shadcn/components/ui/field";
import { InputGroupAddon } from "#/client/shared/shadcn/components/ui/input-group";
import {
	RadioGroup,
	RadioGroupItem,
} from "#/client/shared/shadcn/components/ui/radio-group";

export function PetSpeciesBreedField() {
	const {
		speciesId,
		selectedSpecies,
		isDog,
		isCat,
		isExoticMode,
		isExoticPopoverOpen,
		setIsExoticPopoverOpen,
		exoticSearchQuery,
		filteredExoticSpecies,
		isAddingNewSpeciesInline,
		newSpeciesName,
		speciesError,
		breedId,
		currentBreedLabel,
		filteredBreeds,
		isBreedPopoverOpen,
		setIsBreedPopoverOpen,
		breedSearchQuery,
		isAddingCustomBreedInline,
		newCustomBreedInput,
		isQuickAddCustomBreedVisible,
		breedError,
		handleSelectSpecies,
		handleEnterExoticMode,
		handleLeaveExoticMode,
		handleSelectBreed,
		handleCreateCustomBreed,
		handleCreateCustomSpecies,
		handleStartAddNewSpecies,
		handleCancelNewSpeciesInline,
		handleStartAddCustomBreed,
		handleCancelCustomBreedInline,
		handleExoticSearchChange,
		handleBreedSearchChange,
		handleNewSpeciesNameChange,
		handleNewCustomBreedInputChange,
		handleBreedSearchKeyDown,
		handleCustomBreedInputKeyDown,
		handleExoticSearchKeyDown,
		handleNewSpeciesNameKeyDown,
	} = usePetSpeciesBreed();

	return (
		<AppFieldSet>
			<AppFieldLegend>
				<Dna aria-hidden="true" />
				<span>ชนิดสัตว์และสายพันธุ์</span>
			</AppFieldLegend>
			<FieldContent className="gap-y-6">
				<Field data-invalid={Boolean(speciesError)}>
					<AppFieldLabel>
						<span>ชนิดสัตว์</span>
						<span className="font-bold text-destructive">*</span>
					</AppFieldLabel>

					{!isExoticMode ? (
						<FieldContent className="flex flex-col gap-1">
							<RadioGroup
								value={String(speciesId)}
								onValueChange={(value) => handleSelectSpecies(Number(value))}
								className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2"
							>
								<AppFieldLabel htmlFor="species-dog" className="cursor-pointer">
									<Field
										orientation="horizontal"
										className="w-full items-center justify-between"
									>
										<div className="flex items-center gap-3">
											<div
												className={cn(
													"flex size-9 items-center justify-center rounded-full transition-colors",
													isDog
														? "bg-primary text-primary-foreground"
														: "bg-muted text-muted-foreground",
												)}
											>
												<Dog className="size-4" aria-hidden="true" />
											</div>
											<FieldContent className="gap-0.5">
												<AppFieldTitle>สุนัข</AppFieldTitle>
												<AppFieldDescription>สุนัข / ลูกสุนัข</AppFieldDescription>
											</FieldContent>
										</div>
										<RadioGroupItem value="1" id="species-dog" />
									</Field>
								</AppFieldLabel>

								<AppFieldLabel htmlFor="species-cat" className="cursor-pointer">
									<Field
										orientation="horizontal"
										className="w-full items-center justify-between"
									>
										<div className="flex items-center gap-3">
											<div
												className={cn(
													"flex size-9 items-center justify-center rounded-full transition-colors",
													isCat
														? "bg-primary text-primary-foreground"
														: "bg-muted text-muted-foreground",
												)}
											>
												<Cat className="size-4" aria-hidden="true" />
											</div>
											<FieldContent className="gap-0.5">
												<AppFieldTitle>แมว</AppFieldTitle>
												<AppFieldDescription>แมว / ลูกแมว</AppFieldDescription>
											</FieldContent>
										</div>
										<RadioGroupItem value="2" id="species-cat" />
									</Field>
								</AppFieldLabel>
							</RadioGroup>

							<div className="flex justify-end">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={handleEnterExoticMode}
									className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
								>
									<Plus className="size-3.5" aria-hidden="true" />
									<span>สัตว์เลี้ยงพิเศษและอื่นๆ</span>
								</Button>
							</div>
						</FieldContent>
					) : (
						<FieldContent className="flex flex-col gap-1">
							<DropdownMenu
								open={isExoticPopoverOpen}
								onOpenChange={setIsExoticPopoverOpen}
							>
								<DropdownMenuTrigger
									render={
										<Button
											type="button"
											variant="outline"
											className="h-18 gap-x-3 rounded-2xl px-4.5 py-6"
										/>
									}
								>
									<span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
										<AppSpeciesIcon code={selectedSpecies?.code} />
									</span>
									<span className="flex flex-col items-start gap-0">
										<AppFieldTitle className="truncate">
											{selectedSpecies?.nameTh || selectedSpecies?.name}
										</AppFieldTitle>
									</span>
									<ChevronsUpDown
										className="ml-auto size-4 shrink-0 opacity-50"
										aria-hidden="true"
									/>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="bg-popover/95 backdrop-blur-md">
									<DropdownMenuGroup>
										<AppInputGroup>
											<AppInputGroupInput
												placeholder="ค้นหาสัตว์เลี้ยงพิเศษ (เช่น กระต่าย, แฮมสเตอร์, นก, งู)..."
												value={exoticSearchQuery}
												onChange={handleExoticSearchChange}
												onKeyDown={handleExoticSearchKeyDown}
												autoFocus
											/>
											<InputGroupAddon>
												<Search
													className="size-4 text-muted-foreground"
													aria-hidden="true"
												/>
											</InputGroupAddon>
										</AppInputGroup>
										<DropdownMenuSeparator />
										<DropdownMenuRadioGroup
											value={String(speciesId)}
											onValueChange={(value) =>
												handleSelectSpecies(Number(value))
											}
										>
											<div className="max-h-48 overflow-y-auto">
												{filteredExoticSpecies.length === 0 ? (
													<div className="py-4 text-center text-xs text-muted-foreground">
														ไม่พบชนิดสัตว์ที่ตรงกับ &quot;{exoticSearchQuery}&quot;
													</div>
												) : (
													filteredExoticSpecies.map((species) => (
														<DropdownMenuRadioItem
															key={species.id}
															value={String(species.id)}
															closeOnClick
														>
															<AppSpeciesIcon code={species.code} />
															<span>{species.nameTh || species.name}</span>
														</DropdownMenuRadioItem>
													))
												)}
											</div>
										</DropdownMenuRadioGroup>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										{!isAddingNewSpeciesInline ? (
											<Button
												type="button"
												variant="link"
												size="xs"
												className="w-full justify-end"
												onClick={handleStartAddNewSpecies}
											>
												<Plus className="size-4 shrink-0" aria-hidden="true" />
												<span>เพิ่มชนิดสัตว์ใหม่</span>
											</Button>
										) : (
											<Field className="gap-2 p-1">
												<AppFieldLabel
													htmlFor="register-new-species"
													className="pl-2 text-xs!"
												>
													ลงทะเบียนชนิดสัตว์ใหม่
												</AppFieldLabel>
												<div className="flex items-center gap-1.5">
													<AppInput
														id="register-new-species"
														placeholder="ชื่อชนิดสัตว์ (เช่น เม่นแคระ, เฟอร์เรต)"
														value={newSpeciesName}
														onChange={handleNewSpeciesNameChange}
														onKeyDown={handleNewSpeciesNameKeyDown}
														className="h-7 text-xs"
													/>
													<Button
														type="button"
														size="sm"
														disabled={!newSpeciesName.trim()}
														onClick={handleCreateCustomSpecies}
														className="h-7 px-2.5 text-xs"
													>
														บันทึกและเลือก
													</Button>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={handleCancelNewSpeciesInline}
														className="h-7 px-2 text-xs"
													>
														ยกเลิก
													</Button>
												</div>
											</Field>
										)}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>

							<div className="flex justify-start">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={handleLeaveExoticMode}
									title="กลับไปเลือกสุนัข / แมว"
									className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
								>
									<ArrowLeft className="size-3.5" aria-hidden="true" />
									<span>กลับไปเลือกสุนัข / แมว</span>
								</Button>
							</div>
						</FieldContent>
					)}

					{speciesError ? <AppFieldError>{speciesError}</AppFieldError> : null}
				</Field>

				<Field data-invalid={Boolean(breedError)}>
					<AppFieldLabel htmlFor="breed-select-trigger">
						<span>สายพันธุ์</span>
						<span className="font-bold text-destructive">*</span>
					</AppFieldLabel>
					<DropdownMenu
						open={isBreedPopoverOpen}
						onOpenChange={setIsBreedPopoverOpen}
					>
						<DropdownMenuTrigger
							id="breed-select-trigger"
							render={
								<Button
									type="button"
									variant="outline"
									role="combobox"
									aria-expanded={isBreedPopoverOpen}
									className={cn(
										"w-full justify-between font-normal",
										!breedId && "text-muted-foreground",
									)}
								/>
							}
						>
							<span className="truncate">{currentBreedLabel}</span>
							<ChevronsUpDown
								className="ml-2 size-4 shrink-0 opacity-50"
								aria-hidden="true"
							/>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="bg-popover/95 backdrop-blur-md">
							<DropdownMenuGroup>
								<AppInputGroup>
									<AppInputGroupInput
										placeholder="ค้นหาหรือพิมพ์สายพันธุ์ใหม่..."
										value={breedSearchQuery}
										onChange={handleBreedSearchChange}
										onKeyDown={handleBreedSearchKeyDown}
										className="text-xs"
										autoFocus
									/>
									<InputGroupAddon>
										<Search
											className="size-4 text-muted-foreground"
											aria-hidden="true"
										/>
									</InputGroupAddon>
								</AppInputGroup>
								<DropdownMenuSeparator />
								<DropdownMenuRadioGroup
									value={String(breedId)}
									onValueChange={(value) => handleSelectBreed(Number(value))}
								>
									<div className="max-h-56 overflow-y-auto">
										{filteredBreeds.length === 0 ? (
											<div className="py-4 text-center text-xs text-muted-foreground">
												ไม่พบสายพันธุ์ที่ตรงกับ &quot;{breedSearchQuery}&quot;
											</div>
										) : (
											filteredBreeds.map((breed) => (
												<DropdownMenuRadioItem
													value={String(breed.id)}
													key={breed.id}
													closeOnClick
												>
													<span className="font-medium text-foreground">
														{breed.breedName}
													</span>
												</DropdownMenuRadioItem>
											))
										)}
									</div>
								</DropdownMenuRadioGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									{isQuickAddCustomBreedVisible ? (
										<Button
											type="button"
											size="xs"
											variant="link"
											className="w-full justify-end"
											onClick={() => handleCreateCustomBreed(breedSearchQuery)}
										>
											<Plus aria-hidden="true" />
											<span className="truncate">
												เพิ่ม &quot;{breedSearchQuery.trim()}&quot; เป็นสายพันธุ์ใหม่
											</span>
										</Button>
									) : !isAddingCustomBreedInline ? (
										<Button
											type="button"
											size="xs"
											onClick={handleStartAddCustomBreed}
											className="w-full justify-end"
											variant="link"
										>
											<Plus aria-hidden="true" />
											<span>เพิ่มสายพันธุ์กำหนดเอง</span>
										</Button>
									) : (
										<Field className="gap-2 p-1">
											<AppFieldLabel
												htmlFor="new-breed-input"
												className="pl-2 text-xs!"
											>
												เพิ่มสายพันธุ์ใหม่สำหรับ{" "}
												{selectedSpecies?.nameTh || selectedSpecies?.name}
											</AppFieldLabel>
											<div className="flex items-center gap-1.5">
												<AppInput
													id="new-breed-input"
													placeholder="ระบุชื่อสายพันธุ์ใหม่..."
													value={newCustomBreedInput}
													onChange={handleNewCustomBreedInputChange}
													onKeyDown={handleCustomBreedInputKeyDown}
													className="h-7 flex-1 text-xs"
													autoFocus
												/>
												<Button
													type="button"
													size="sm"
													disabled={!newCustomBreedInput.trim()}
													onClick={() =>
														handleCreateCustomBreed(newCustomBreedInput)
													}
													className="h-7 px-2.5 text-xs"
												>
													เพิ่ม
												</Button>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={handleCancelCustomBreedInline}
													className="h-7 px-2 text-xs"
												>
													ยกเลิก
												</Button>
											</div>
										</Field>
									)}
								</DropdownMenuGroup>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>

					{breedError ? <AppFieldError>{breedError}</AppFieldError> : null}
				</Field>
			</FieldContent>
		</AppFieldSet>
	);
}
