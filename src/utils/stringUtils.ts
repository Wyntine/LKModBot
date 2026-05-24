export function capitalize<T extends string>(str: T): Capitalize<T> {
  return (
    str[0] !== undefined ? str[0].toLocaleUpperCase() + str.slice(1) : str
  ) as Capitalize<T>;
}
