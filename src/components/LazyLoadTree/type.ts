/*
 * @author: 刘汇源lwx188666
 * @since: 2023-08-31
 * type.ts
 */

export enum NodeOriginalType {
    EQ = 1,
    Other = -1,
}

export interface PointConfig extends Record<any, number | string> {
    width: number;
    height: number;
}

// 原始的树形数据应该满足的数据结构
export interface TreeData extends Record<string, any> {
    uniqueUuid: string;
    originalType: number;
    children?: TreeData[];
}

// 用于渲染的数据的数据类型
export interface RenderTreeData {
    uniqueUuid: string;
    width: number;
    height: number;
    x: number;
    y: number;
    data: null | TreeData;
    children: RenderTreeData[];
}