import { TextField } from '@mui/material';
import type { WrapperInputProps } from '../types';

export const WrapperInput = ({
    label,
    type,
    variant = 'outlined',
    required,
    fullWidth,
    ...props
}: WrapperInputProps) => {
  return (
    <TextField label={label}  type={type} variant={variant} required={required} fullWidth={fullWidth} {...props}>
      {label}
    </TextField>
  );
};