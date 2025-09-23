import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'contained',
  size = 'large',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={`${className}`}
      sx={{
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 700,
        minHeight: size === 'large' ? '34px' : size === 'medium' ? '24px' : '12px',
        '&.MuiButton-root': {
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'inherit',
          padding: 'inherit',
          margin: 'inherit',
          width: 'inherit',
          height: 'inherit',
          minHeight: 'inherit',
          maxHeight: 'inherit',
          minWidth: 'inherit',
          maxWidth: 'inherit',
        },
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
      {children}
    </Button>
  );
};

export default CustomButton;
