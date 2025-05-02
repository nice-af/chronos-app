import { Document } from 'jira.js/src/version3/models';

type Node = Omit<Document, 'version'>;

/**
 * Converts Atlassian Document Format (ADF) to Markdown.
 *
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/
 *
 * Mostly based on the `adf-to-md` package.
 * @see https://github.com/julianlam/adf-to-md
 */
function convert(this: any, node: Node): string {
  switch (node.type) {
    case 'doc':
      return node.content!.map(subNode => convert(subNode)).join('\n');

    case 'text':
      return `${convertMarks(node)}`;

    case 'paragraph':
      return node.content!.map(subNode => convert(subNode)).join('');

    case 'heading':
      return `${'#'.repeat(node.attrs.level as number)} ${node.content!.map(subNode => convert(subNode)).join('')}\n`;

    case 'hardBreak':
      return '\n';

    case 'inlineCard':
    case 'blockCard':
    case 'embedCard':
      return `[${node.attrs.url}](${node.attrs.url})`;

    case 'blockquote':
      return `> ${node
        .content!.map((subNode, i) => `${convert(subNode)}${i !== node.content!.length - 1 ? '\n>' : ''}`)
        .join('\n> ')}`;

    case 'bulletList':
    case 'orderedList':
      return `${node
        .content!.map(subNode => {
          const converted = convert.call(node, subNode);

          if (node.type === 'orderedList') {
            node.attrs ??= { order: 1 };
            node.attrs.order += 1;
          }

          return converted;
        })
        .join('\n')}`;

    case 'listItem': {
      const order = this.attrs?.order ?? 1;
      const symbol = this.type === 'bulletList' ? '*' : `${order}.`;
      return `${symbol} ${node.content!.map(subNode => convert(subNode).trimEnd()).join(' ')}`;
    }

    case 'codeBlock': {
      const language = node.attrs.language ? ` ${node.attrs.language}` : '';
      return `\`\`\`${language}\n${node.content!.map(subNode => convert(subNode)).join('\n')}\n\`\`\``;
    }

    case 'rule':
      return '\n---\n';

    case 'emoji':
      return node.attrs.shortName as string;

    case 'table':
      return node.content!.map(subNode => convert(subNode)).join('');

    case 'tableRow': {
      let output = '|';
      let thCount = 0;
      output += node
        .content!.map(subNode => {
          thCount += subNode.type === 'tableHeader' ? 1 : 0;
          return convert(subNode);
        })
        .join('');
      output += thCount ? `\n${'|:-:'.repeat(thCount)}|\n` : '\n';
      return output;
    }

    case 'tableHeader':
      return `${node.content!.map(subNode => convert(subNode)).join('')}|`;

    case 'tableCell':
      return `${node.content!.map(subNode => convert(subNode)).join('')}|`;

    case 'mediaSingle':
      return node.content!.map(subNode => convert(subNode)).join('\n');

    case 'media':
      return `![](${node.attrs.url})`;

    default:
      // TODO log this to somewhere
      console.error('Unknown ADF node encountered', node.type);
      return '';
  }
}

function convertMarks(node: Node) {
  if (!node.hasOwnProperty('marks') || !Array.isArray(node.marks)) {
    return node.text;
  }

  return node.marks.reduce((converted, mark) => {
    switch (mark.type) {
      case 'code':
        converted = `\`${converted}\``;
        break;

      case 'em':
        converted = `*${converted}*`;
        break;

      case 'link':
        converted = `[${converted}](${mark.attrs.href})`;
        break;

      case 'strike':
        converted = `~${converted}~`;
        break;

      case 'strong':
        converted = `**${converted}**`;
        break;

      default: // not supported
        break;
    }

    return converted;
  }, node.text);
}

export default convert;
