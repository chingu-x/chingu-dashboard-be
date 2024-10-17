export type ValidateOrGetDbItemGlobalFunc = <T>(
    dbTableName: string,
    searchValue: string | number | [number, string] | null | [string, string],
    searchField?: string,
    findOptions?: string,
    whereOptions?: Record<string, any>,
    queryOptions?: Record<string, any>,
    customErrorMessage?: () => never,
) => Promise<T | null>;
