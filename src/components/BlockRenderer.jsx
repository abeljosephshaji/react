import React from 'react';
import { TextBlock } from './blocks/TextBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ButtonBlock } from './blocks/ButtonBlock';
import { DividerBlock } from './blocks/DividerBlock';
import { ColumnBlock } from './blocks/ColumnBlock';

// React.memo to prevent unnecessary re-renders of individual blocks
export const BlockRenderer = React.memo(function BlockRenderer({ block, ...props }) {
    switch (block.type) {
        case 'text':
            return <TextBlock block={block} {...props} />;
        case 'image':
            return <ImageBlock block={block} {...props} />;
        case 'button':
            return <ButtonBlock block={block} {...props} />;
        case 'divider':
            return <DividerBlock block={block} {...props} />;
        case 'column':
            return <ColumnBlock block={block} {...props} />;
        default:
            return <div>Unknown block type</div>;
    }
});
