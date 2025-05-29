import {defineCollection, z} from 'astro:content';

// Define the base schema for all content
const baseSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    order: z.number().default(0),
    date: z.date().optional(),
    external: z.string().optional(),
});

// Get all directory names in the content folder
// is this possible to do dynamically?
const contentDirectories = ["applied-practice", "artistic-practice", "teaching", "research", "contact"];

// Create collection configs
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
