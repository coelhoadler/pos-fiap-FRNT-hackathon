import { WrapperIcon } from '../../shared/WrapperIcon';
import { MoreVertical } from 'lucide-react';
import type { WrapperIconProps } from '../../shared/types';

export const MoreVerticalIcon = ({
  size = 20,
  className,
  ...props
}: Omit<WrapperIconProps, 'Icon'>) => {
  return <WrapperIcon Icon={MoreVertical} size={size} className={className} {...props} />;
};
