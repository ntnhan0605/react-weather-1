import type { JSX, SVGProps } from 'react';

export type DataAttributes = {
  [key: `data-${string}`]: string | number;
};

export type IconComponent =
  | React.ComponentType<React.SVGProps<SVGSVGElement>>
  | ((props: SVGProps<SVGSVGElement>) => JSX.Element);

export type Size = 'sm' | 'md' | 'lg';
