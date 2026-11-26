import type { Owner } from "../entities/owner.entity";

export interface IOwnerRepository {
	findById(ownerId: number): Promise<Owner | null>;
	create(owner: Owner): Promise<Owner>;
	update(owner: Owner): Promise<void>;
	deleteById(ownerId: number): Promise<void>;
}
