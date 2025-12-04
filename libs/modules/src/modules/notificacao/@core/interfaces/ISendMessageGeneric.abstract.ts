export abstract class ISendMessagesGeneric<T> {
    abstract send(message_pattern: T): Promise<void>
}