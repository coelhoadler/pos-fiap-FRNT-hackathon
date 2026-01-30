import { WrapperInput } from '../../shared/WrapperInput';
import type { WrapperInputProps } from '../../shared/types';

export const PasswordTextFieldInput = ({
  label = 'Senha',
  type = 'password',
  fullWidth,
  required,
  variant = 'outlined',
  ...props
}: WrapperInputProps) => {
  return (
    <WrapperInput label={label} variant={variant} type={type} fullWidth={fullWidth} required={required} {...props} />
  );
};