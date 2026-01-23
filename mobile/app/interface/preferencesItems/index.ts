export interface IPreferencesItem {
    title:string,
    description?:string,
    id:string
}
export interface IPreferencesItems {
    preferencesItems: IPreferencesItem[];
}