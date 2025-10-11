import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'contained',
  size = 'large',
  fullWidth = false,
  loading = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={loading || props.disabled}
      className={`${className}`}
      sx={{
        borderRadius: '12px',
        textTransform: 'none',
        minHeight: size === 'large' ? '34px' : size === 'medium' ? '24px' : '12px',
        '&.MuiButton-root': {
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'inherit',
          margin: 'inherit',
          width: 'inherit',
          height: 'inherit',
          minHeight: 'inherit',
          maxHeight: 'inherit',
          minWidth: 'inherit',
          maxWidth: 'inherit',
        },
        '&.Mui-disabled': {
          backgroundColor: variant === 'contained' ? 'var(--color-gray-300)' : 'transparent',
          color: 'var(--color-gray-500)',
          borderColor: variant === 'outlined' ? 'var(--color-gray-300)' : 'transparent',
          opacity: 0.7,
        },
        ...(loading && variant === 'contained' && {
          backgroundColor: 'var(--color-primary-500) !important',
          color: '#fff !important',
          opacity: 0.8,
          '&.Mui-disabled': {
            backgroundColor: 'var(--color-primary-500) !important',
            color: '#fff !important',
            opacity: 0.8,
          },
        }),
        ...(loading && variant === 'outlined' && {
          borderColor: 'var(--color-primary-500) !important',
          color: 'var(--color-primary-500) !important',
          '&.Mui-disabled': {
            borderColor: 'var(--color-primary-500) !important',
            color: 'var(--color-primary-500) !important',
            opacity: 0.8,
          },
        }),
        ...(variant === 'contained' && {
          backgroundColor: 'var(--color-primary-500)',
          color: '#fff',
          '&:hover': {
            backgroundColor: 'var(--color-primary-600)',
          },
        }),
        ...(variant === 'outlined' && {
          borderColor: 'var(--color-primary-500)',
          color: 'var(--color-primary-500)',
          '&:hover': {
            borderColor: 'var(--color-primary-600)',
            color: 'var(--color-primary-600)',
          },
        }),
        ...(variant === 'text' && {
          color: 'var(--color-primary-500)',
          '&:hover': {
            backgroundColor: 'var(--color-primary-300)',
          },
        }),
        ...props.sx,
      }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default CustomButton;
