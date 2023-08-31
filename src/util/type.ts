/*
 * @author: 刘汇源lwx188666
 * @since: 2023-08-28
 * type.ts
 */

// 原始的树形数据应该满足的数据结构
export interface TreeData extends Record<string, any> {
    uniqueUuid: string;
    originalType: number;
    children?: TreeData[] | null;
}
