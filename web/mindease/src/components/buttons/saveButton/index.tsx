import { WrapperButton } from '../../Shared/WrapperButton';
import type { WrapperButtonProps } from '../../Shared/Types';

export const SaveButton = ({
  label = 'Salvar',
  variant = 'contained',
  color = 'success',
  ...props
}: WrapperButtonProps) => {
  return (
    <WrapperButton label={label} variant={variant} color={color} {...props} />
  );
};
