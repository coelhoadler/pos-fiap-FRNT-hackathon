import type { WrapperButtonProps } from "../../shared/types";
import { WrapperButton } from "../../shared/wrapperButton/WrapperButton";

export const LoginButton = ({ label = 'Login', variant = 'contained', color = 'primary', ...props }: WrapperButtonProps) => {
    return (
        <WrapperButton
            label={label}
            variant={variant}
            color={color}
            {...props}
        />
    );
}