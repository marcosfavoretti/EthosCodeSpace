export interface IPowerbiRefreshObserver{
    emit(message: string):void|Promise<void>;
}