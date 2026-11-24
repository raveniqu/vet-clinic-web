import { CheckCircle, Eye, Info, Microscope, Pencil } from "lucide-react";
import { AppButtonLink } from "#/client/shared/components/app-link";
import { formatMicrochipNumber, formatPetAge } from "#/client/shared/helpers/formatters";
import { Alert, AlertTitle } from "#/client/shared/shadcn/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "#/client/shared/shadcn/components/ui/avatar";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/client/shared/shadcn/components/ui/card";
import { usePetRowActions } from "#/client/features/reception/pets/hooks/use-pet-row-actions";
import {
  getPetInitials,
  PET_SEX_LABEL_MAP,
  REPRODUCTIVE_STATUS_LABEL_MAP,
} from "#/client/features/reception/pets/models/pets-table";

export function PetGridCard() {
  const { pet, handleEdit } = usePetRowActions();

  return (
    <Card className="justify-start">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="size-16">
            <AvatarImage src={pet.photo} alt={pet.petName} />
            <AvatarFallback>{getPetInitials(pet.petName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle>{pet.petName}</CardTitle>
            <CardDescription className="text-xs">{pet.breedName}</CardDescription>

            <div className="flex items-center gap-1">
              <Badge variant="secondary">{PET_SEX_LABEL_MAP[pet.sex]}</Badge>
              <Badge variant={pet.reproductiveStatus === "Intact" ? "destructive" : "outline"}>
                {REPRODUCTIVE_STATUS_LABEL_MAP[pet.reproductiveStatus]}
              </Badge>
            </div>
          </div>
        </div>
        <CardAction>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={handleEdit}
            aria-label={`แก้ไขข้อมูลของ ${pet.petName}`}
          >
            <Pencil aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-4">
        <div className="flex justify-between rounded-xl bg-muted-foreground/5 p-4">
          <p className="text-xs">
            <span>อายุ:</span>
            <span className="font-semibold"> {formatPetAge(pet)}</span>
          </p>
          <p className="text-xs">
            <span>น้ำหนักล่าสุด:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {" "}
              {pet.weight}
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400"> กก.</span>
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs">
            <span>เจ้าของ:</span>
            <span className="font-semibold"> {pet.ownerName}</span>
          </p>

          {pet.microchipNumber ? (
            <Badge variant="secondary" className="font-mono">
              {formatMicrochipNumber(pet.microchipNumber)}
            </Badge>
          ) : null}
        </div>
        {pet.allergies ? (
          <Alert className="border-0 bg-primary/5 px-2 py-1 text-primary ring-1 ring-primary/50 dark:bg-primary/5 dark:text-primary dark:ring-primary/50">
            <Info aria-hidden="true" />
            <AlertTitle className="text-sm font-medium">{pet.allergies}</AlertTitle>
          </Alert>
        ) : (
          <Alert className="border-0 px-2 py-1 ring-1 ring-border">
            <CheckCircle
              className="stroke-emerald-600 dark:stroke-emerald-400"
              aria-hidden="true"
            />
            <AlertTitle className="text-sm font-medium">ไม่มีประวัติแพ้ยา / อาหาร</AlertTitle>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="justify-between border-t">
        <Button size="xs" variant="outline">
          <Microscope data-icon="inline-start" aria-hidden="true" />
          <span>เปิดเวชระเบียน (EMR)</span>
        </Button>
        <AppButtonLink
          to="/pets/$petId"
          params={{ petId: String(pet.id) }}
          size="xs"
          variant="link"
        >
          <Eye aria-hidden="true" />
          <span>ดูประวัติ</span>
        </AppButtonLink>
      </CardFooter>
    </Card>
  );
}
