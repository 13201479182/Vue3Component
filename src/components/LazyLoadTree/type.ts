/*
 * @author: 刘汇源lwx188666
 * @since: 2023-08-31
 * type.ts
 */
export interface PointConfig extends Record<any, number | string> {
    width: number;
    height: number;
}

// 原始的树形数据应该满足的数据结构
export interface RenderData extends Record<string, any> {
    uniqueUuid: string;
    originalType: number;
    children?: RenderData[];
}

// 用于渲染的数据的数据类型
export interface TreeNode {
    width: number;
    height: number;
    x: number;
    y: number;
    data: null | RenderData;
    parent: null | TreeNode;
    children: TreeNode[];
}
