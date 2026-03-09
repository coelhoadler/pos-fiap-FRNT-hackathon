import { WrapperIcon } from '../../shared/WrapperIcon';
import { FolderKanban } from 'lucide-react';
import type { WrapperIconProps } from '../../shared/types';

export const FolderKanbanIcon = ({
  size = 20,
  className,
  ...props
}: Omit<WrapperIconProps, 'Icon'>) => {
  return <WrapperIcon Icon={FolderKanban} size={size} className={className} {...props} />;
};
