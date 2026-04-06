import { createClient } from 'next-sanity';
import { sanityConfig } from './env';

export const sanityClient = createClient(sanityConfig);
