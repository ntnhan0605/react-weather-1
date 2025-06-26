import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import {
  useCallback,
  useEffect,
  useState,
  type ChangeEventHandler,
  type FC,
} from 'react';

export type InputSearchComponentProps = {
  defaultValue?: string;
  value?: string;
  onChange?: (val: string) => void;
  onSearch?: (val: string) => void;
};

export const InputSearchComponent: FC<InputSearchComponentProps> = (props) => {
  const {
    defaultValue,
    value: valueProps,
    onChange: onChangeProps,
    onSearch: onSearchProps,
  } = props;

  const [value, setValue] = useState<string>();

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const val = e.target.value;
      setValue(val);
      onChangeProps?.(val);
    },
    [onChangeProps]
  );

  const onSearch = useCallback(() => {
    onSearchProps?.(value || '');
  }, [value, onSearchProps]);

  useEffect(() => {
    setValue(valueProps);
  }, [valueProps]);

  return (
    <Box className="flex gap-[10px] lg:gap-[20px]">
      <TextField
        label="Country"
        placeholder="Input your country"
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        size="medium"
        variant="filled"
        className="flex-1 min-w-0"
        slotProps={{
          input: {
            className:
              'min-h-[40px] lg:min-h-[60px] before:hidden after:hidden !bg-[var(--input-bg)] !rounded-lg lg:!rounded-2xl',
          },
          inputLabel: {
            className:
              'max-lg:!text-sm !top-[-6px] lg:!top-1 lg:!left-3 !text-[var(--input-label-color)]',
          },
          htmlInput: {
            className: '!pl-3 !pt-3 !pb-1 lg:!pt-6 lg:!pb-2 lg:!pl-6',
          },
        }}
      />
      <IconButton
        onClick={onSearch}
        className="max-lg:w-[40px] w-[60px] !rounded-lg lg:!rounded-2xl !bg-[var(--button-bg)] !text-white"
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
};
