import { WrapperIcon } from '../../shared/WrapperIcon';
import { ChevronDown } from 'lucide-react';
import type { WrapperIconProps } from '../../shared/types';

export const ChevronDownIcon = ({
  size = 20,
  className,
  ...props
}: Omit<WrapperIconProps, 'Icon'>) => {
  return <WrapperIcon Icon={ChevronDown} size={size} className={className} {...props} />;
};
