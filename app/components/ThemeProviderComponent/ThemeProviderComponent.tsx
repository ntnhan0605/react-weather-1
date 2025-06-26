import { ThemeProvider } from '@mui/material/styles';
import type { FC, PropsWithChildren } from 'react';
import { theme } from './ThemeProviderComponent.helpers';

export type ThemeProviderComponentProps = {
  defaultMode?: 'light' | 'dark' | 'system';
};

export const ThemeProviderComponent: FC<
  PropsWithChildren<ThemeProviderComponentProps>
> = (props) => {
  const { defaultMode = 'light', children } = props;
  return (
    <ThemeProvider theme={theme} defaultMode={defaultMode}>
      {children}
    </ThemeProvider>
  );
};
