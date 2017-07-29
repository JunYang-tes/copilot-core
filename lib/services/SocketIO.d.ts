export interface ISocketIOParam {
    namespace: string;
}
export interface IClient {
    send(event: string, msg: any): void;
    onJson(event: string, cb: (arg: any) => void): any;
    close(): void;
}
export interface ISocket {
    on<T>(event: string, cb: (arg: T) => void): any;
    emit(event: string, msg: any): any;
}
export declare class SocketIO implements ISocket {
    private events;
    private io;
    constructor({namespace}: ISocketIOParam);
    on<T>(event: string, cb: (arg: T) => void): void;
    emit(event: string, msg: any): void;
}
export declare class OriginalWebSocket implements ISocket {
    private events;
    constructor({namespace}: ISocketIOParam);
    on<T>(event: string, cb: (arg: T) => void): void;
    emit(event: string, msg: any): void;
}
