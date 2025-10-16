import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import pgvector from 'pgvector';
import { Repository } from 'typeorm';
import { Embedding } from './embedding.entity';

@Injectable()
export class EmbeddingService {
  constructor(
    @InjectRepository(Embedding)
    private embeddingRepository: Repository<Embedding>,
  ) {}

  async drawEmbedding(): Promise<Embedding> {
    const embedding = new Embedding();

    embedding.embedding = Array(Math.floor(Math.random() * 10) + 1).fill(0).map(() => Math.random());
    embedding.embedding_3d = Array(3).fill(0).map(() => Math.random());
    embedding.halfvec_embedding = Array(4).fill(0).map(() => Math.random());

    // embedding.embedding = pgvector.toSql(Array(3).fill(0).map(() => Math.random()));
    // embedding.embedding_3d = pgvector.toSql(Array(3).fill(0).map(() => Math.random()));
    // embedding.halfvec_embedding = pgvector.toSql(Array(4).fill(0).map(() => Math.random()));

    return this.embeddingRepository.save(embedding);
  }

  findAllPaged(pageNo = 0, pageSize = 10) {
    return this.embeddingRepository.find({
      take: pageSize,
      skip: pageNo * pageSize,
      order: {
        id: 'DESC',
      },
    });
  }
}
