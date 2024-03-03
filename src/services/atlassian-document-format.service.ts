import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import { Document } from 'jira.js/out/version3/models';
import convert from './adf/converter';

export function convertAdfToMd(adf: Document) {
  return convert(adf as any);
}

export function convertMdToAdf(markdown: string): Document {
  const transformer = new MarkdownTransformer(defaultSchema);
  const topLevelNode = transformer.parse(markdown);
  return { ...(topLevelNode.toJSON() as Document), version: 1 };
}
