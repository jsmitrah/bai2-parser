export interface IReadField<V> {
  value: V;
  newStart: number;
  error: Error | null;
}
