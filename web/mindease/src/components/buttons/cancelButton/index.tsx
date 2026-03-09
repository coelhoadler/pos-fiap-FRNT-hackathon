import { WrapperButton } from '../../shared/WrapperButton';
import type { WrapperButtonProps } from '../../shared/types';

export const CancelButton = ({
  label = 'Cancelar',
  variant = 'outlined',
  color = 'error',
  ...props
}: WrapperButtonProps) => {
  return (
    <WrapperButton label={label} variant={variant} color={color} {...props} />
  );
};
