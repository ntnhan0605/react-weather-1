import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('figma', 'routes/figma.tsx'),
] satisfies RouteConfig;
