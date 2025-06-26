import Box from '@mui/material/Box';
import { type FC, type PropsWithChildren } from 'react';
import {
  ThemeProviderComponent,
  type ThemeProviderComponentProps,
} from '../ThemeProviderComponent';

export type MainComponentProps = Pick<
  ThemeProviderComponentProps,
  'defaultMode'
>;

const MainComponentContainer: FC<Readonly<{ children: React.ReactNode }>> = (
  props
) => {
  const { children } = props;
  return (
    <Box
      className="min-h-screen bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: 'var(--bg-root)' }}
    >
      <Box className="max-w-2xl py-6 px-4 mx-auto">{children}</Box>
    </Box>
  );
};

export const MainComponent: FC<PropsWithChildren<MainComponentProps>> = (
  props
) => {
  const { defaultMode, children } = props;
  return (
    <ThemeProviderComponent defaultMode={defaultMode}>
      <MainComponentContainer>{children}</MainComponentContainer>
    </ThemeProviderComponent>
  );
};
