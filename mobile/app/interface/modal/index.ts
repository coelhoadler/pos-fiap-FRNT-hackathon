import { StyleProp, ViewStyle } from "react-native";

export interface IModal {
    children?: React.ReactNode;
    text?: string;
    onClose?: () => void;
    open?: boolean;
    style?: StyleProp<ViewStyle>;
    textButton?: string;
    textButtonActionA?: string;
    textButtonActionB?: string;
    onPressActionA?: () => void;
    onPressActionB?: () => void;
    contentType: "feedbackMessage" | "withActions" | 'loading' | 'legend';
    textLoading?: string;
    sizeLoading?: number;
}

export interface IModalLegend {
    onClose?: () => void;
    open?: boolean;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
export interface IModalLegendProjects extends IModalLegend {
    legendContentItems?: ILegendContentItem[];
    subtitleContentItem?:string;
}

export interface ILegendContent{
    style?: StyleProp<ViewStyle>;
    subtitle?:string;
    legendItems?: ILegendContentItem[];
}
export interface ILegendContentItem{
    description:string;
    icon?: React.ReactElement;
}