/*
 * @author: 刘汇源lwx188666
 * @since: 2023-08-31
 * treeData.ts
 */

import type { TreeData } from '../components/LazyLoadTree/type';

export const treeData: TreeData = {
    type: 'circle',
    uniqueUuid: '1',
    originalType: 1,
    children: [
        {
            uniqueUuid: '1-1',
            originalType: 1,
            children: [
                {
                    uniqueUuid: '1-1-1',
                    originalType: 2,
                    children: [],
                },
                {
                    uniqueUuid: '1-1-2',
                    originalType: 3,
                    children: [],
                },
                {
                    uniqueUuid: '1-1-3',
                    originalType: 1,
                    children: [],
                },
            ],
        },
        {
            uniqueUuid: '1-2',
            originalType: 99,
            children: [
                {
                    uniqueUuid: '1-2-1',
                    originalType: 1,
                    children: [
                        {
                            uniqueUuid: '1-2-1-1',
                            originalType: 1,
                            children: [],
                        },
                        {
                            uniqueUuid: '1-2-1-2',
                            originalType: 3,
                            children: [],
                        },
                    ],
                },
                {
                    uniqueUuid: '1-2-2',
                    originalType: 5,
                    children: [],
                },
                {
                    uniqueUuid: '1-2-3',
                    originalType: 6,
                    children: [],
                },
                {
                    uniqueUuid: '1-2-4',
                    originalType: 1,
                    children: [],
                },
            ],
        },
    ],
};

export const treeTestData: TreeData = {
    uniqueUuid: '1-1-3',
    originalType: 1,
    children: [
        {
            uniqueUuid: '1-1-3-1',
            originalType: 1,
            children: [
                {
                    uniqueUuid: '1-1-3-1-1',
                    originalType: 1,
                    children: [
                        {
                            uniqueUuid: '1-1-3-1-1-1',
                            originalType: 6,
                            children: [],
                        },
                    ],
                },
            ],
        },
        {
            uniqueUuid: '1-1-3-2',
            originalType: 3,
            children: [],
        },
        {
            uniqueUuid: '1-1-3-3',
            originalType: 2,
            children: [],
        },
    ],
};
