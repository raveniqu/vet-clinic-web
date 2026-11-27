import { AlertTriangle, Cat, Dog, PawPrint } from "lucide-react";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemTitle,
} from "#/client/shared/shadcn/components/ui/item";

export function PetsSummary() {
	const summary = [
		{
			title: "สัตว์เลี้ยงทั้งหมด",
			value: 5,
			icon: <PawPrint className="size-5" />,
			iconColor: "bg-info/10 text-info",
		},
		{
			title: "สุนัข",
			value: 3,
			icon: <Dog className="size-5" />,
			iconColor: "bg-warning/10 text-warning",
		},
		{
			title: "แมว",
			value: 2,
			icon: <Cat className="size-5" />,
			iconColor: "bg-success/10 text-success",
		},
		{
			title: "เฝ้าระวัง",
			value: 3,
			icon: <AlertTriangle className="size-5" />,
			iconColor: "bg-destructive/10 text-destructive",
		},
	];

	return (
		<ItemGroup className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
			{summary.map((item) => (
				<Item key={item.title} className={`${item.iconColor}`} size="sm">
					<ItemContent>
						<ItemDescription>{item.title}</ItemDescription>
						<ItemTitle className="text-xl md:text-2xl">{item.value}</ItemTitle>
					</ItemContent>
					<ItemActions>
						<span className={`${item.iconColor} rounded-full p-2`}>
							{item.icon}
						</span>
					</ItemActions>
				</Item>
			))}
		</ItemGroup>
	);
}
