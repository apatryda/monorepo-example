// import { Test, TestingModule } from '@nestjs/testing';
import { EmbeddingController } from './embedding.controller';

describe('EmbeddingController', () => {
  let controller: EmbeddingController | undefined = undefined;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [EmbeddingController],
  //   }).compile();

  //   controller = module.get<EmbeddingController>(EmbeddingController);
  // });

  it('should be not defined', () => {
    expect(controller).not.toBeDefined();
  });
});
