const extractLinks = (text) => {
    const regex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;
    const links = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      links.push(match[2]);
    }
    return links;
  };
  
  const parseMarkdown = (markdownText) => {
    const lines = markdownText.split('\n');
    const chunks = [];
    let currentHeadings = [];
    let tableBuffer = [];
    let paragraphBuffer = [];
  
    const flushParagraph = () => {
      if (paragraphBuffer.length > 0) {
        const content = [...currentHeadings, '', ...paragraphBuffer].join('\n').trim();
        chunks.push({
          type: 'paragraph',
          content,
          links: extractLinks(content),
        });
        paragraphBuffer = [];
      }
    };
  
    const flushTable = () => {
      if (tableBuffer.length > 1) {
        const headers = tableBuffer[0].split('|').map(h => h.trim()).filter(Boolean);
        for (let i = 2; i < tableBuffer.length; i++) {
          const values = tableBuffer[i].split('|').map(v => v.trim());
          let content = '';
          for (let j = 0; j < headers.length; j++) {
            content += `${headers[j]}: ${values[j] || ''}\n`;
          }
          content = [...currentHeadings, '', content.trim()].join('\n');
          chunks.push({
            type: 'tableRow',
            content,
            links: extractLinks(content),
          });
        }
      }
      tableBuffer = [];
    };
  
    for (let line of lines) {
      const trimmed = line.trim();
  
   
      const headingMatch = /^(#{1,10})\s+(.*)/.exec(trimmed);
      if (headingMatch) {
        flushParagraph();
        flushTable();
        const level = headingMatch[1].length;
        currentHeadings = currentHeadings.slice(0, level - 1);
        currentHeadings[level - 1] = `${'#'.repeat(level)} ${headingMatch[2]}`;
        currentHeadings = currentHeadings.slice(0, level);
        continue;
      }
  
      
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushParagraph();
        tableBuffer.push(trimmed);
        continue;
      } else {
        if (tableBuffer.length > 0) {
          flushTable();
        }
      }
  
      
      if (trimmed === '') {
        flushParagraph();
      } else {
        paragraphBuffer.push(line);
      }
    }
  
    flushParagraph();
    flushTable();
    return chunks;
  };
  
  module.exports = parseMarkdown;
  