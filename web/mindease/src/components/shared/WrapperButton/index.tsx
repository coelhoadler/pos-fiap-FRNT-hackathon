import { Button } from '@mui/material';
import type { WrapperButtonProps } from '../Types';

export const WrapperButton = ({
  label,
  variant = 'contained',
  color = 'primary',
  ...props
}: WrapperButtonProps) => {
  return (
    <Button variant={variant} color={color} {...props}>
      {label}
    </Button>
  );
};
