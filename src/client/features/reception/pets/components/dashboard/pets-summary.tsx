import { AlertTriangle, Cat, Dog, PawPrint } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "#/client/shared/shadcn/components/ui/item";

import { usePets } from "#/client/features/reception/pets/hooks/use-pets";

export function PetsSummary() {
  const { totalPets, totalDogs, totalCats, totalAllergies } = usePets();

  const summary = [
    {
      title: "สัตว์เลี้ยงทั้งหมด",
      value: totalPets,
      icon: <PawPrint className="size-5" />,
      iconColor: "bg-primary/10 text-primary",
    },
    {
      title: "สุนัข",
      value: totalDogs,
      icon: <Dog className="size-5" />,
      iconColor: "bg-amber-500/10 text-amber-500",
    },
    {
      title: "แมว",
      value: totalCats,
      icon: <Cat className="size-5" />,
      iconColor: "bg-green-500/10 text-green-500",
    },
    {
      title: "มีประวัติแพ้",
      value: totalAllergies,
      icon: <AlertTriangle className="size-5" />,
      iconColor: "bg-rose-500/10 text-rose-500",
    },
  ];

  return (
    <ItemGroup className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {summary.map((item) => (
        <Item key={item.title} className={`${item.iconColor} rounded-3xl`} size="sm">
          <ItemContent>
            <ItemDescription>{item.title}</ItemDescription>
            <ItemTitle className="text-xl md:text-2xl">{item.value}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <span className={`${item.iconColor} rounded-full p-2`}>{item.icon}</span>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}
