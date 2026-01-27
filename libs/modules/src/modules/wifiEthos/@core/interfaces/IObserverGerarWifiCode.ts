import { WifiCodeManager } from "../entities/WifiCodeManager.entity";
export const IObserverGerarWifiCode = Symbol('IObserverGerarWifiCode');
export interface IObserverGerarWifiCode {
    onCreate(wifiManager: WifiCodeManager): Promise<void>;
}