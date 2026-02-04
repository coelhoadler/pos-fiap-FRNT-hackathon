import type { WrapperIconProps } from '../types';

export const WrapperIcon = ({
  Icon,
  size = 20,
  className,
  ...props
}: WrapperIconProps) => {
  return <Icon size={size} className={className} {...props} />;
};
