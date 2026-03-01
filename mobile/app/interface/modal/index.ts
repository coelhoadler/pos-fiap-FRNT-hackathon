import { StyleProp, ViewStyle } from "react-native";

export interface IModal {
    children?: React.ReactNode;
    text?: string;
    onClose?: () => void;
    onPress?: () => void;
    open?: boolean;
    style?: StyleProp<ViewStyle>;
    styleContainer?: StyleProp<ViewStyle>;
    styleLoading?: StyleProp<ViewStyle>;
    styleBackdrop?: StyleProp<ViewStyle>;
    textButton?: string;
    textButtonActionA?: string;
    textButtonActionB?: string;
    onPressActionA?: () => void;
    onPressActionB?: () => void;
    contentType: "feedbackMessage" | "withActions" | 'loading' | 'legend' |'customModal';
    textLoading?: string;
    sizeLoading?: number;
    loading?:boolean;
    hasCloseButton?:boolean;
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
export interface IModalLegendTasks extends IModalLegend {
    legendContentItems?: ILegendContentItem[];
    subtitleContentItem?:string;
}

export interface ILegendContent{
    style?: StyleProp<ViewStyle>;
    subtitle?:string;
    legendItems?: ILegendContentItem[];
}
export interface ILegendContentItem{
    description:string | React.ReactElement;
    icon?: React.ReactElement;
    styleLegendIcon?: StyleProp<ViewStyle>;
}