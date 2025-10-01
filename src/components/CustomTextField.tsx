import { TextField, InputAdornment, IconButton } from '@mui/material';
import type { OutlinedInputProps } from '@mui/material/OutlinedInput';
import type { TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';

export interface CustomTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

const CustomTextField = forwardRef<HTMLDivElement, CustomTextFieldProps>(
  ({ sx, error, rightIcon, onRightIconClick, slotProps, ...props }, ref) => {
    const inputSlotProps = (slotProps?.input || {}) as Partial<OutlinedInputProps>;
    const mergedSlotProps = {
      ...slotProps,
      input: {
        ...inputSlotProps,
        endAdornment: rightIcon ? (
          <InputAdornment position="end">
            {onRightIconClick ? (
              <IconButton
                aria-label="right icon"
                onClick={onRightIconClick}
                edge="end"
                size="small"
                tabIndex={-1}
              >
                {rightIcon}
              </IconButton>
            ) : (
              rightIcon
            )}
          </InputAdornment>
        ) : inputSlotProps.endAdornment,
      } as Partial<OutlinedInputProps>,
    } as TextFieldProps['slotProps'];
    return (
      <TextField
        ref={ref}
        variant="outlined"
        error={error}
        slotProps={mergedSlotProps}
        sx={{
          fontFamily: 'var(--font-family-sans)',
          '& .MuiInputBase-root': {
            fontFamily: 'var(--font-family-sans)',
            backgroundColor: 'transparent',
          },
          '& .MuiInputLabel-root': {
            fontFamily: 'var(--font-family-sans)',
            color: 'var(--color-gray-500)',
            '&.Mui-focused': {
              color: 'var(--color-primary-500)',
            },
            '&.Mui-error': {
              color: 'var(--color-error)',
            },
          },
          '& .MuiFormHelperText-root': {
            fontFamily: 'var(--font-family-sans)',
            '&.Mui-error': {
              color: 'var(--color-error)',
            },
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-primary-500)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-primary-500)',
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-error)',
            },
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'var(--color-gray-400)',
            opacity: 1,
          },
          ...sx,
        }}
        {...props}
      />
    );
  }
);

CustomTextField.displayName = 'CustomTextField';

export default CustomTextField;