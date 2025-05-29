import {defineCollection, z} from 'astro:content';

const baseSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    order: z.number().default(0),
    date: z.date().optional(),
    external: z.string().optional(),
});

const contentDirectories = ["applied-practice", "artistic-practice", "teaching", "research", "contact"];

const collections = Object.fromEntries(
    contentDirectories.map(dir => [
        dir,
        defineCollection({
            type: 'content',
            schema: baseSchema,
        })
    ])
);

export {collections};
