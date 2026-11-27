import { cn } from "cn";
import {
	OctagonAlert,
	ShieldAlert,
	Smile,
	TriangleAlert,
	Zap,
} from "lucide-react";
import { usePetCautionForm } from "#/client/features/pets/hooks/use-pet-caution-form";
import type { TemperamentAlert } from "#/client/features/pets/models/pet-form.model";
import {
	AppFieldDescription,
	AppFieldLabel,
	AppFieldLegend,
	AppFieldSet,
	AppFieldTitle,
} from "#/client/shared/components/app-field";
import {
	Field,
	FieldContent,
} from "#/client/shared/shadcn/components/ui/field";
import {
	RadioGroup,
	RadioGroupItem,
} from "#/client/shared/shadcn/components/ui/radio-group";

const TEMPERAMENT_OPTIONS: readonly {
	value: TemperamentAlert;
	title: string;
	description: string;
	icon: typeof Smile;
}[] = [
	{
		value: "Docile",
		title: "เชื่อง / อ่อนโยน",
		description: "นิสัยเรียบร้อย จับบังคับได้ง่าย",
		icon: Smile,
	},
	{
		value: "Nervous",
		title: "ตื่นกลัว / กังวล",
		description: "ขี้กลัว ตกใจง่าย ควรเข้าหาอย่างนุ่มนวล",
		icon: Zap,
	},
	{
		value: "Aggressive",
		title: "ดุ / ก้าวร้าว",
		description: "อาจกัดหรือข่วนเมื่อตกใจหรือถูกกระตุ้น",
		icon: TriangleAlert,
	},
	{
		value: "Needs Muzzle",
		title: "ต้องใส่ตะกร้อครอบปาก",
		description: "ต้องใช้อุปกรณ์ควบคุมเพื่อความปลอดภัยขณะตรวจ",
		icon: OctagonAlert,
	},
];

export function PetTemperamentField() {
	const { temperament, handleTemperamentChange } = usePetCautionForm();

	return (
		<AppFieldSet>
			<AppFieldLegend>
				<ShieldAlert aria-hidden="true" />
				<span>นิสัยและข้อควรระวังในการจับบังคับ</span>
			</AppFieldLegend>

			<Field>
				<AppFieldLabel>
					<span>ระดับการแจ้งเตือนความปลอดภัยของเจ้าหน้าที่</span>
					<span className="font-bold text-destructive">*</span>
				</AppFieldLabel>

				<RadioGroup
					value={temperament}
					onValueChange={handleTemperamentChange}
					className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
				>
					{TEMPERAMENT_OPTIONS.map((option) => {
						const isSelected = temperament === option.value;
						const IconComponent = option.icon;
						const id = `temp-${option.value.toLowerCase().replace(/\s+/g, "-")}`;

						return (
							<AppFieldLabel
								key={option.value}
								htmlFor={id}
								className="cursor-pointer"
							>
								<Field
									orientation="horizontal"
									className="w-full items-center justify-between"
								>
									<div className="flex items-center gap-3">
										<div
											className={cn(
												"flex size-9 items-center justify-center rounded-full transition-colors",
												isSelected
													? "bg-primary text-primary-foreground"
													: "bg-muted text-muted-foreground",
											)}
										>
											<IconComponent className="size-4" aria-hidden="true" />
										</div>
										<FieldContent className="gap-0.5">
											<AppFieldTitle>{option.title}</AppFieldTitle>
											<AppFieldDescription>
												{option.description}
											</AppFieldDescription>
										</FieldContent>
									</div>
									<RadioGroupItem value={option.value} id={id} />
								</Field>
							</AppFieldLabel>
						);
					})}
				</RadioGroup>
			</Field>
		</AppFieldSet>
	);
}
