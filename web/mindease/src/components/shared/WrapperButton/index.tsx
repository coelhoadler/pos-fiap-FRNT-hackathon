import { Button } from '@mui/material';
import type { WrapperButtonProps } from '../types';

export const WrapperButton = ({
  label,
  variant = 'contained',
  className,
  fullWidth,
  sx,
  ...props
}: WrapperButtonProps & { className?: string }) => {
  return (
    <Button 
      variant={variant} 
      fullWidth={fullWidth} 
      {...props} 
      sx={{ minWidth: 0, ...sx }}
      classes={{ root: "w-full bg-black hover:bg-gray-800 text-white" }}
      >
      {label}
    </Button>
  );
};
