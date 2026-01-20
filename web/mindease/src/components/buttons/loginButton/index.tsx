import type { WrapperButtonProps } from '../../Shared/Types';
import { WrapperButton } from '../../Shared/WrapperButton';

export const LoginButton = ({
  label = 'Login',
  variant = 'contained',
  color = 'primary',
  ...props
}: WrapperButtonProps) => {
  return (
    <WrapperButton label={label} variant={variant} color={color} {...props} />
  );
};
