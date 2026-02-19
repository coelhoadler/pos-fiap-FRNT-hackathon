export interface IActionsButton {
    children?:React.ReactElement;
}
export interface IActionsButtonProjects {
    pathAdd?:string;
    openModal?: () => void;
    onPressSetting?: () => void;
    onlyInformationButton?:boolean;
    hasSettingItem?:boolean;
}