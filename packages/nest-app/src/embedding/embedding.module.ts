import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmbeddingController } from './embedding.controller';
import { Embedding } from './embedding.entity';
import { EmbeddingService } from './embedding.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Embedding])
  ],
  controllers: [EmbeddingController],
  providers: [EmbeddingService],
})
export class EmbeddingModule {}
