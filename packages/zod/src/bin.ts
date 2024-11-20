import { generatorHandler } from '@prisma/generator-helper';
import { onGenerate, onManifest } from './bin-api';

generatorHandler({
  onManifest,
  onGenerate,
});
