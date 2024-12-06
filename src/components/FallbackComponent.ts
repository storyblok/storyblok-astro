import type { SbBlokData } from '@storyblok/js';

declare const FallbackComponent: (_props: {
  blok: SbBlokData; // Required property for Storyblok
  [prop: string]: unknown; // Allow additional properties
}) => any;
export default FallbackComponent;
