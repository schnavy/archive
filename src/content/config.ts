import { defineCollection, z } from 'astro:content';

// Define the base schema for all content
const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  order: z.number().default(0),
  isIndex: z.boolean().default(false),
});

// Get all directory names in the content folder
const contentDirectories = ['projects', 'research', 'docs', 'experiments'];

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

export { collections }; 