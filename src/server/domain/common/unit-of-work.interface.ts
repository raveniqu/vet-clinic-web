export interface IUnitOfWork {
  readonly withTransaction: <T>(work: () => Promise<T>) => Promise<T>;
}
