import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a block with a unique ID and default properties based on type
 * @param {string} type - 'text', 'image', 'button', 'divider', or 'column'
 * @returns {object} Block data object
 */
export function createBlock(type) {
  const baseBlock = {
    id: uuidv4(),
    type,
  };

  switch (type) {
    case 'text':
      return {
        ...baseBlock,
        content: '',
        align: 'left',
        fontSize: '16px',
      };
    case 'image':
      return {
        ...baseBlock,
        url: '',
        width: '100%',
        align: 'center',
      };
    case 'button':
      return {
        ...baseBlock,
        label: 'Click me',
        color: '#3b82f6',
        align: 'center',
        url: '#',
      };
    case 'divider':
      return {
        ...baseBlock,
      };
    case 'column':
      return {
        ...baseBlock,
        columns: 2,
        children: {
          col1: [],
          col2: [],
        },
      };
    default:
      return baseBlock;
  }
}
