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
  const commentData = topLevelNode.toJSON() as Document;

  // The ADF MarkdownTransformer sometimes adds a localId attribute with a null value
  // This is not valid ADF and will cause the API to return a 400 error
  if (commentData.content) {
    commentData.content.forEach(content => {
      if (content.attrs && content.attrs.localId === null) {
        delete content.attrs.localId;
      }
      // Remove attrs if empty
      if (content.attrs && Object.keys(content.attrs).length === 0) {
        delete content.attrs;
      }
    });
  }

  return { ...commentData, version: 1 };
}
