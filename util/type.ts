/*
 * @author: 刘汇源lwx188666
 * @since: 2023-08-28
 * type.ts
 */

export enum NodeOriginalType {
    EQ = 1,
    AI = 2,
    AIO = 3,
    AO = 4,
    DI = 5,
    DIO = 6,
    DO = 7,
    FieldPoint = 8,
}

// 原始的树形数据应该满足的数据结构
export interface TreeData extends Record<string, any> {
    uniqueUuid: string;
    originalType: NodeOriginalType;
    children?: TreeData[] | null;
}
