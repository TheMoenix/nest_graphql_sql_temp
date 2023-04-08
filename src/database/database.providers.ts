import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'example',
        database: 'moenix',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true, // remove with production
        // retryAttempts: 3,
      });

      return dataSource.initialize();
    },
  },
];
