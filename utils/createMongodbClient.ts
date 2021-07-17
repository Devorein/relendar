import { MongoClient } from 'mongodb';

export function createMongodbClient() {
  return new MongoClient(
    process.env.MONGODB_CONNECTION_URL as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any
  );
}
