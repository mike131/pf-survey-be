import { connect as mongoConnect, ConnectOptions, Mongoose } from 'mongoose';

export const connect = (
  url = '',
  opts: ConnectOptions = {}
): Promise<Mongoose> => {
  return mongoConnect(url, {
    ...opts,
    useNewUrlParser: true,
  } as ConnectOptions);
};
