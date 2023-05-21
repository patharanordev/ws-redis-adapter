export interface IRedisSubscribe {
  prefix: string;
}
export interface IRedisEventNames {
  adapter: string;
}
export interface IRedisPubSub {
  subscribe: IRedisSubscribe;
  eventNames: IRedisEventNames;
}
export interface IRedisConfig {
  connection: any;
  pubsub: IRedisPubSub;
}
