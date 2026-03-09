import { WrapperButton } from '../../shared/WrapperButton';
import type { WrapperButtonProps } from '../../shared/types';

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