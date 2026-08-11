import { FactoryProvider } from '@nestjs/common';
import {
  load,
  UniversalSentenceEncoder,
} from '@tensorflow-models/universal-sentence-encoder';

export default {
  provide: UniversalSentenceEncoder,
  useFactory: load,
} as FactoryProvider<UniversalSentenceEncoder>;
