import { Document } from 'jira.js/out/version3/models';

export function extractTextFromJSON(json: Omit<Document, 'version'>) {
  let text = '';

  // Keep track of the previous node type
  let previousNodeType: string | null = null;

  // Iterate through all content
  (json.content ?? []).forEach(content => {
    // If the content has "text" property, append it to the string with or without a newline character
    if (content.hasOwnProperty('text')) {
      // Check if the current node type is the same as the previous node type
      if (content.type === previousNodeType) {
        text += content.text;
      } else {
        text += '\n' + content.text;
      }

      // Update the previous node type
      previousNodeType = content.type;
    }
    // If the content has "content" property, recurse through it
    if (content.hasOwnProperty('content')) {
      text += extractTextFromJSON(content);
    }
  });

  if (text.startsWith('\n')) {
    text = text.slice(1);
  }

  return text;
}
