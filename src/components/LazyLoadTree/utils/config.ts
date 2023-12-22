import { treeData } from '@/mocks/lazyLoadTreeData';

// 枚举节点类型
export enum nodeOriginalType {
    EQ = 1,
    PointList = -999,
}
// 配置节点属性
export const nodeConfig: Record<keyof typeof nodeOriginalType, { width: number; height: number }> = {
    EQ: {
        width: 100,
        height: 100,
    },
    PointList: {
        width: 150,
        height: 450,
    },
};

// 首屏加载
export function syncLoadScreen() {
    return Promise.resolve(treeData);
}
// 懒加载叶子节点
export function lazyLoadBlock() {}
// 懒加载块内列表
export function lazyLoadList() {}
