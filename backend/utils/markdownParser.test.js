const parseMarkdown = require('./markdownParser');

describe('Markdown Parser', () => {
  const sampleMarkdown = `# Heading 1

This is the first paragraph with a [link](https://example.com).

## Heading 2

This is the second paragraph.

- List item 1
- List item 2

`;

  it('should parse into chunks with heading context and links', () => {
    const result = parseMarkdown(sampleMarkdown);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);

    const firstChunk = result[0];
    expect(firstChunk).toHaveProperty('content');
    expect(firstChunk).toHaveProperty('links');

    expect(firstChunk.content).toContain('Heading 1');
    expect(firstChunk.links).toContain('https://example.com');
  });
});