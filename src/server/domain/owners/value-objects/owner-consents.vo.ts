import { ValueObject } from "#/server/domain/common/value-object.base";

export interface OwnerConsentsProps {
	readonly privacyPolicy: boolean;
	readonly marketing: boolean;
	readonly appointment: boolean;
	readonly media: boolean;
	readonly research: boolean;
}

export class OwnerConsents extends ValueObject<OwnerConsentsProps> {
	private constructor(props: OwnerConsentsProps) {
		super(props);
	}

	static create(props: OwnerConsentsProps): OwnerConsents {
		return new OwnerConsents({
			privacyPolicy: Boolean(props.privacyPolicy),
			marketing: Boolean(props.marketing),
			appointment: Boolean(props.appointment),
			media: Boolean(props.media),
			research: Boolean(props.research),
		});
	}

	withUpdates(partial: Partial<OwnerConsentsProps>): OwnerConsents {
		return OwnerConsents.create({
			...this.props,
			...partial,
		});
	}

	get privacyPolicy(): boolean {
		return this.props.privacyPolicy;
	}

	get marketing(): boolean {
		return this.props.marketing;
	}

	get appointment(): boolean {
		return this.props.appointment;
	}

	get media(): boolean {
		return this.props.media;
	}

	get research(): boolean {
		return this.props.research;
	}

	toPlainObject(): OwnerConsentsProps {
		return { ...this.props };
	}
}
