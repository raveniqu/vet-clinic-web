import type { CreateOwnerInput, OwnerDto, UpdateOwnerInput } from "#/shared/schemas/owner.schema";

export interface IOwnerRepository {
  readonly getAll: () => Promise<OwnerDto[]>;
  readonly getById: (id: string) => Promise<OwnerDto | null>;
  readonly create: (input: CreateOwnerInput) => Promise<OwnerDto>;
  readonly update: (input: UpdateOwnerInput) => Promise<OwnerDto>;
}
