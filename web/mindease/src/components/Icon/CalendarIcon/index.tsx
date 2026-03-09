import { WrapperIcon } from '../../shared/WrapperIcon';
import { Calendar } from 'lucide-react';
import type { WrapperIconProps } from '../../shared/types';

export const CalendarIcon = ({
  size = 20,
  className,
  ...props
}: Omit<WrapperIconProps, 'Icon'>) => {
  return <WrapperIcon Icon={Calendar} size={size} className={className} {...props} />;
};
