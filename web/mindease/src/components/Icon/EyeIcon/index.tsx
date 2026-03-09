import { WrapperIcon } from '../../shared/WrapperIcon';
import { Eye } from 'lucide-react';
import type { WrapperIconProps } from '../../shared/types';

export const EyeIcon = ({
  size = 20,
  className,
  ...props
}: Omit<WrapperIconProps, 'Icon'>) => {
  return <WrapperIcon Icon={Eye} size={size} className={className} {...props} />;
};
