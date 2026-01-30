import type { ButtonProps } from "@mui/material/Button";
import type { TextFieldProps } from "@mui/material/TextField";

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