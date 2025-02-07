/*
    key - a more user friendly name for sort field
    value - prisma sort field
    sorting is only supported for fields listed here
*/
export const soloProjectSortMap: Map<string, string> = new Map(
    Object.entries({
        status: "statusId",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    }),
);

export const soloProjectSortMapKeys: string[] = Array.from(
    soloProjectSortMap.keys(),
);
