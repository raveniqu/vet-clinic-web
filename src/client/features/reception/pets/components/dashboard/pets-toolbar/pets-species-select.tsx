import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/client/shared/shadcn/components/ui/select";

import { usePetSelection } from "#/client/features/reception/pets/hooks/use-pet-selection";

export function PetsSpeciesSelect() {
  const { selectItems, selectedSpeciesId, onSelectedSpeciesId } = usePetSelection();

  return (
    <Select
      value={selectedSpeciesId}
      items={selectItems}
      onValueChange={(val) => onSelectedSpeciesId(Number(val))}
    >
      <SelectTrigger
        size="sm"
        className="w-fit border-0 bg-transparent shadow-md/10 inset-shadow-sm/5 dark:ring-1 dark:ring-border"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        alignItemWithTrigger={false}
        align="end"
        className="bg-transparent backdrop-blur-md"
      >
        <SelectGroup>
          {selectItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
