import type { WrapperButtonProps } from '../../shared/types';
import { WrapperButton } from '../../shared/WrapperButton';

export const LoginButton = ({
  label = 'Login',
  variant = 'contained',
  fullWidth,
  className,
  ...props
}: WrapperButtonProps) => {
  return (
    <WrapperButton label={label} variant={variant} {...props} />
  );
};
