/* todo: this config is used for accessing collections with astro api – check if there is a way to fetch collections dynamically */
/*
import { defineCollection, z } from 'astro:content';

// Define the base schema for all content
const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  order: z.number().default(0),
});

// Get all directory names in the content folder
// is this possible to do dynamically?
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

export { collections }; */
