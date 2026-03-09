import { WrapperIcon } from '../../shared/WrapperIcon';
import { ChevronUp } from 'lucide-react';
import type { WrapperIconProps } from '../../shared/types';

export const ChevronUpIcon = ({
  size = 20,
  className,
  ...props
}: Omit<WrapperIconProps, 'Icon'>) => {
  return <WrapperIcon Icon={ChevronUp} size={size} className={className} {...props} />;
};
