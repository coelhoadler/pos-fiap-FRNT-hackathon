import { WrapperButton } from '../../Shared/WrapperButton';
import type { WrapperButtonProps } from '../../Shared/Types';

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
