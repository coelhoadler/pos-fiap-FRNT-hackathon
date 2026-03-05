import { WrapperIcon } from '../../shared/WrapperIcon';
import { Info } from 'lucide-react';
import type { WrapperIconProps } from '../../shared/types';

export const InfoIcon = ({
  size = 20,
  className,
  ...props
}: Omit<WrapperIconProps, 'Icon'>) => {
  return <WrapperIcon Icon={Info} size={size} className={className} {...props} />;
};
