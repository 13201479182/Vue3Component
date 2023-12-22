/*
 * @author: 刘汇源lwx188666
 * @since: 2023-08-31
 * treeData.ts
 */
import Mock from 'mockjs';
import type { RenderData } from '@/components/LazyLoadTree/type';

export const treeData: RenderData = {
    uniqueUuid: Mock.Random.uuid(),
    originalType: 1,
    name: Mock.Random.cname(),
    children: [
        {
            uniqueUuid: Mock.Random.uuid(),
            originalType: 1,
            name: Mock.Random.cname(),
            children: [
                {
                    uniqueUuid: Mock.Random.uuid(),
                    originalType: 1,
                    name: Mock.Random.cname(),
                    children: [
                        {
                            uniqueUuid: Mock.Random.uuid(),
                            originalType: 1,
                            name: Mock.Random.cname(),
                            children: [],
                        },
                    ],
                    modelList: Mock.mock({
                        'list|500-3000': [
                            {
                                'uniqueUuid': '@uuid',
                                'name': '@cname',
                                'originalType|2-9': 2,
                            },
                        ],
                    }).list,
                },
            ],
        },
        {
            uniqueUuid: Mock.Random.uuid(),
            originalType: 1,
            name: Mock.Random.cname(),
            children: [
                {
                    uniqueUuid: Mock.Random.uuid(),
                    originalType: 1,
                    name: Mock.Random.cname(),
                    children: [],
                },
            ],
            modelList: Mock.mock({
                'list|500-3000': [
                    {
                        'uniqueUuid': '@uuid',
                        'name': '@cname',
                        'originalType|2-9': 2,
                    },
                ],
            }).list,
        },
        {
            uniqueUuid: Mock.Random.uuid(),
            originalType: 1,
            name: Mock.Random.cname(),
            children: [
                {
                    uniqueUuid: Mock.Random.uuid(),
                    originalType: 1,
                    name: Mock.Random.cname(),
                    children: [
                        {
                            uniqueUuid: Mock.Random.uuid(),
                            originalType: 1,
                            name: Mock.Random.cname(),
                            children: [],
                        },
                        {
                            uniqueUuid: Mock.Random.uuid(),
                            originalType: 1,
                            name: Mock.Random.cname(),
                            children: [],
                            modelList: Mock.mock({
                                'list|500-3000': [
                                    {
                                        'uniqueUuid': '@uuid',
                                        'name': '@cname',
                                        'originalType|2-9': 2,
                                    },
                                ],
                            }).list,
                        },
                    ],
                },
            ],
            modelList: Mock.mock({
                'list|500-3000': [
                    {
                        'uniqueUuid': '@uuid',
                        'name': '@cname',
                        'originalType|2-9': 2,
                    },
                ],
            }).list,
        },
    ],
};
