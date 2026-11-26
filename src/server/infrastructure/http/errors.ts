export type InfrastructureErrorCode = "UPSTREAM_SERVICE_ERROR";

export abstract class InfrastructureError extends Error {
	readonly code: InfrastructureErrorCode;

	protected constructor(message: string, code: InfrastructureErrorCode) {
		super(message);
		this.name = new.target.name;
		this.code = code;
	}
}

export class UpstreamServiceError extends InfrastructureError {
	constructor(message: string) {
		super(message, "UPSTREAM_SERVICE_ERROR");
	}
}
