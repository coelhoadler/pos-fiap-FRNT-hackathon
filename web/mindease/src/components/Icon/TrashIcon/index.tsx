import { WrapperIcon } from '../../shared/WrapperIcon';
import { Trash2 } from 'lucide-react';
import type { WrapperIconProps } from '../../shared/types';

export const TrashIcon = ({
  size = 20,
  className,
  ...props
}: Omit<WrapperIconProps, 'Icon'>) => {
  return <WrapperIcon Icon={Trash2} size={size} className={className} {...props} />;
};
