import type { ButtonProps } from "@mui/material/Button";
import type { TextFieldProps } from "@mui/material/TextField";
import type { LucideIcon } from "lucide-react";

export type WrapperButtonProps = {
    label: string;   
} & Partial<ButtonProps> & {
    className?: string;
}

export type WrapperInputProps = {
    label: string;
} & Partial<TextFieldProps> & {
    className?: string;
}

export type WrapperIconProps = {
    Icon: LucideIcon;
    size?: number;
} & {
    className?: string;
    [key: string]: any;
}