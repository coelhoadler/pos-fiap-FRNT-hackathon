import { WrapperInput } from '../../shared/WrapperInput';
import type { WrapperInputProps } from '../../shared/types';

export const EmailTextFieldInput = ({
  label = 'E-mail',
  type = 'email',
  fullWidth,
  required,
  variant = 'outlined',
  ...props
}: WrapperInputProps) => {
  return (
    <WrapperInput label={label} variant={variant} type={type} fullWidth={fullWidth} required={required} {...props} />
  );
};