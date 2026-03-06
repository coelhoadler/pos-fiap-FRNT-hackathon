import { WrapperIcon } from '../../shared/WrapperIcon';
import { Play } from 'lucide-react';
import type { WrapperIconProps } from '../../shared/types';

export const PlayIcon = ({
  size = 20,
  className,
  ...props
}: Omit<WrapperIconProps, 'Icon'>) => {
  return (
    <WrapperIcon Icon={Play} size={size} className={className} {...props} />
  );
};
