import { WrapperIcon } from '../../shared/WrapperIcon';
import { Clock } from 'lucide-react';
import type { WrapperIconProps } from '../../shared/types';

export const ClockIcon = ({
  size = 20,
  className,
  ...props
}: Omit<WrapperIconProps, 'Icon'>) => {
  return <WrapperIcon Icon={Clock} size={size} className={className} {...props} />;
};
