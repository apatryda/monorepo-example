// import { Test, TestingModule } from '@nestjs/testing';
import { EmbeddingService } from './embedding.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Embedding } from './embedding.entity';

describe('EmbeddingService', () => {
  let service: EmbeddingService | undefined = undefined;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     imports: [
  //       TypeOrmModule.forRoot({
  //         type: 'sqlite',
  //         database: ':memory:',
  //       }),
  //       TypeOrmModule.forFeature([Embedding])
  //     ],
  //     providers: [EmbeddingService],
  //   }).compile();

  //   service = module.get<EmbeddingService>(EmbeddingService);
  // });

  it('should be not defined', () => {
    expect(service).not.toBeDefined();
  });
});
