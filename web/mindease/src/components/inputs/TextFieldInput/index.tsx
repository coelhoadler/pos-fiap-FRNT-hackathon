import { WrapperInput } from '../../shared/WrapperInput';
import type { WrapperInputProps } from '../../shared/types';

export const TextFieldInput = ({
  label,
  type,
  fullWidth,
  required,
  variant = 'outlined',
  ...props
}: WrapperInputProps) => {
  return (
    <WrapperInput label={label} variant={variant} type={type} fullWidth={fullWidth} required={required} {...props} />
  );
};