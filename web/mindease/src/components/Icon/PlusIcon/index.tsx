import { WrapperIcon } from '../../shared/WrapperIcon';
import { Plus } from 'lucide-react';
import type { WrapperIconProps } from '../../shared/types';

export const PlusIcon = ({
  size = 20,
  className,
  ...props
}: Omit<WrapperIconProps, 'Icon'>) => {
  return <WrapperIcon Icon={Plus} size={size} className={className} {...props} />;
};
