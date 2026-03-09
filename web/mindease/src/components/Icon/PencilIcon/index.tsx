import { WrapperIcon } from '../../shared/WrapperIcon';
import { Pencil } from 'lucide-react';
import type { WrapperIconProps } from '../../shared/types';

export const PencilIcon = ({
  size = 20,
  className,
  ...props
}: Omit<WrapperIconProps, 'Icon'>) => {
  return <WrapperIcon Icon={Pencil} size={size} className={className} {...props} />;
};
