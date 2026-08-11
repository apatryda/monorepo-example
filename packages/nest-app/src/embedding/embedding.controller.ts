import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Logger,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { EmbeddingService } from './embedding.service';

@Controller('embedding')
export class EmbeddingController {
  constructor(private readonly embeddingService: EmbeddingService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.embeddingService.findAllPaged(page, limit);
  }

  @Post()
  async embedText(
    @Body() body: { text: string },
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,
  ) {
    const { embedding } = await this.embeddingService.embedText(body.text);
    Logger.log(`Embedded text: ${body.text}`);
    return this.embeddingService.findClosest(embedding, limit);
  }

  @Get('draw')
  async drawEmbedding() {
    return this.embeddingService.drawEmbedding();
  }
}
