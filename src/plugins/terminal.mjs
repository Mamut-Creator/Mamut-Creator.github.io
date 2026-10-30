// Enmarca todos los bloques Markdown; Shiki conserva su resaltado dentro del pre.
export default function terminalFrames() {
  return (tree) => {
    function walk(parent) {
      if (!parent.children) return;
      parent.children = parent.children.map(node => {
        if (node.tagName !== 'pre') { walk(node); return node; }
        const code = node.children?.find(child => child.tagName === 'code');
        const language = node.properties?.dataLanguage || node.properties?.['data-language'] || code?.properties?.className?.find?.(name => name.startsWith('language-'))?.slice(9) || 'text';
        return { type: 'element', tagName: 'figure', properties: { className: ['code-terminal'] }, children: [
          { type: 'element', tagName: 'figcaption', properties: {}, children: [
            { type: 'element', tagName: 'span', properties: { className: ['terminal-label'] }, children: [{type:'text',value: `›_  ${language}`} ] },
            { type: 'element', tagName: 'button', properties: { type:'button', className:['copy-code'], ariaLabel:'Copiar código' }, children:[{type:'text',value:'Copiar'}] }
          ]}, node
        ]};
      });
    }
    walk(tree);
  };
}
