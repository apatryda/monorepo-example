import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import '@tensorflow/tfjs-node';
import { UniversalSentenceEncoder } from '@tensorflow-models/universal-sentence-encoder';
import pgvector from 'pgvector';
import { Repository } from 'typeorm';
import { Embedding } from './embedding.entity';

@Injectable()
export class EmbeddingService {
  constructor(
    @InjectRepository(Embedding)
    private embeddingRepository: Repository<Embedding>,
    private universalSentenceEncoder: UniversalSentenceEncoder,
  ) {}

  async drawEmbedding(): Promise<Embedding> {
    const embedding = new Embedding();

    embedding.embedding = Array(Math.floor(Math.random() * 10) + 1)
      .fill(0)
      .map(() => Math.random());
    embedding.embedding_3d = Array(3)
      .fill(0)
      .map(() => Math.random());
    embedding.halfvec_embedding = Array(4)
      .fill(0)
      .map(() => Math.random());

    // embedding.embedding = pgvector.toSql(Array(3).fill(0).map(() => Math.random()));
    // embedding.embedding_3d = pgvector.toSql(Array(3).fill(0).map(() => Math.random()));
    // embedding.halfvec_embedding = pgvector.toSql(Array(4).fill(0).map(() => Math.random()));

    return this.embeddingRepository.save(embedding);
  }

  async embedText(text: string): Promise<Embedding> {
    const embeddings = await this.universalSentenceEncoder.embed([text]);
    const embeddingArray = await embeddings.array();
    const [textEmbedding] = embeddingArray;

    let embedding = await this.embeddingRepository.findOneBy({ text });

    if (!embedding) {
      embedding = new Embedding();
      embedding.embedding = textEmbedding;
      embedding.embedding_3d = textEmbedding.slice(0, 3);
      embedding.halfvec_embedding = textEmbedding.slice(0, 4);
      embedding.text = text;
      embedding = await this.embeddingRepository.save(embedding);
    }

    return embedding;
  }

  async findAllPaged(pageNo = 0, pageSize = 10) {
    return this.embeddingRepository.find({
      take: pageSize,
      skip: pageNo * pageSize,
      order: {
        id: 'DESC',
      },
    });
  }

  async findClosest(embedding: number[] | Buffer<ArrayBufferLike>, limit = 5) {
    return this.embeddingRepository
      .createQueryBuilder('embedding')
      .select(['id', 'text'])
      .addSelect(`embedding <=> :embedding`, 'distance')
      .orderBy(`distance`, 'ASC')
      .setParameter('embedding', pgvector.toSql(embedding))
      .limit(limit)
      .getRawMany();
  }
}
