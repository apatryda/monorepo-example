import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmbeddingModule } from './embedding/embedding.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'example',
      password: 'example',
      database: 'example_nest',
      autoLoadEntities: true,
      installExtensions: true,
      synchronize: true,
    }),
    EmbeddingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {

  }

  async onModuleInit() {
    /*
     *  `pgvector` package docs recommend to install the extension manually,
     *  but `typeorm` with `installExtensions: true` should do it automatically
     *  https://www.npmjs.com/package/pgvector#typeorm
     */
    // await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS vector');
  }
}
