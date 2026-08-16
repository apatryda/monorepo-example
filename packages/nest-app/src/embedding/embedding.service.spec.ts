import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UniversalSentenceEncoder } from '@tensorflow-models/universal-sentence-encoder';
import { Embedding } from './embedding.entity';
import { EmbeddingService } from './embedding.service';

describe('EmbeddingService', () => {
  let service: EmbeddingService;
  let findOneByMock: jest.Mock;
  let saveMock: jest.Mock;
  let embedMock: jest.Mock;

  beforeEach(async () => {
    findOneByMock = jest.fn();
    saveMock = jest.fn();
    embedMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmbeddingService,
        {
          provide: getRepositoryToken(Embedding),
          useValue: {
            findOneBy: findOneByMock,
            save: saveMock,
          },
        },
        {
          provide: UniversalSentenceEncoder,
          useValue: {
            embed: embedMock,
          },
        },
      ],
    }).compile();

    service = module.get(EmbeddingService);
  });

  describe('embedText', () => {
    const textEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5];

    beforeEach(() => {
      embedMock.mockResolvedValue({
        array: jest.fn().mockResolvedValue([textEmbedding]),
      });
    });

    describe('when no embedding exists yet for the text', () => {
      const savedEmbedding = new Embedding();
      let result: Embedding;

      beforeEach(async () => {
        findOneByMock.mockResolvedValue(null);
        saveMock.mockResolvedValue(savedEmbedding);

        result = await service.embedText('hello');
      });

      it('should look up an existing embedding by text', () => {
        expect(findOneByMock).toHaveBeenCalledWith({ text: 'hello' });
      });

      it('should save a new embedding built from the encoded vector', () => {
        expect(saveMock).toHaveBeenCalledWith(
          expect.objectContaining({
            text: 'hello',
            embedding: textEmbedding,
            embedding_3d: textEmbedding.slice(0, 3),
            halfvec_embedding: textEmbedding.slice(0, 4),
          }),
        );
      });

      it('should return the saved embedding', () => {
        expect(result).toBe(savedEmbedding);
      });
    });

    describe('when an embedding already exists for the text', () => {
      const existingEmbedding = new Embedding();
      let result: Embedding;

      beforeEach(async () => {
        findOneByMock.mockResolvedValue(existingEmbedding);

        result = await service.embedText('hello');
      });

      it('should not save a new embedding', () => {
        expect(saveMock).not.toHaveBeenCalled();
      });

      it('should return the existing embedding', () => {
        expect(result).toBe(existingEmbedding);
      });
    });
  });
});
