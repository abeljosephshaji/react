import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { BlockRenderer } from '../BlockRenderer';
import { BlockWrapper } from '../BlockWrapper';

// A strict droppable zone for column content
function ColumnZone({ id, items, activeId, onUpdateBlock, onSelectBlock, selectedBlockId, onDeleteBlock }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: {
            type: 'ColumnZone'
        }
    });

    return (
        <div
            ref={setNodeRef}
            className="column-zone"
            style={{
                backgroundColor: isOver ? '#f3f4f6' : '#fafafa',
                borderColor: isOver ? '#3b82f6' : '#e5e7eb'
            }}
        >
            <SortableContext
                id={id}
                items={items.map(b => b.id)}
                strategy={verticalListSortingStrategy}
            >
                {items.map((childBlock) => (
                    <BlockWrapper
                        key={childBlock.id}
                        block={childBlock}
                        isSelected={selectedBlockId === childBlock.id}
                        onSelect={() => onSelectBlock(childBlock)}
                        onDelete={() => onDeleteBlock(childBlock.id)}
                    >
                        <BlockRenderer
                            block={childBlock}
                            onChange={onUpdateBlock}
                        />
                    </BlockWrapper>
                ))}
                {items.length === 0 && (
                    <div className="empty-zone-content">
                        <p>Drag blocks here</p>
                        <div className="zone-quick-actions">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const separator = ':::';
                                    const lastIndex = id.lastIndexOf(separator);
                                    const blockId = id.substring(0, lastIndex);
                                    const colKey = id.substring(lastIndex + separator.length);

                                    onUpdateBlock(blockId, {
                                        action: 'add_child',
                                        colKey: colKey,
                                        type: 'text'
                                    });
                                }}
                            >
                                + Text
                            </button>
                        </div>
                    </div>
                )}
            </SortableContext>
        </div>
    );
}

export function ColumnBlock({ block, activeId, onUpdateBlock, onSelectBlock, selectedBlockId, onDeleteBlock }) {
    // block.children.col1 and block.children.col2 contain the child blocks
    const col1Items = block.children?.col1 || [];
    const col2Items = block.children?.col2 || [];

    return (
        <div
            className="column-block-container"
            style={{
                gridTemplateColumns: block.proportion || `repeat(${block.columns || 2}, 1fr)`
            }}
        >
            <ColumnZone
                id={`${block.id}:::col1`}
                items={col1Items}
                activeId={activeId}
                onUpdateBlock={onUpdateBlock}
                onSelectBlock={onSelectBlock}
                selectedBlockId={selectedBlockId}
                onDeleteBlock={onDeleteBlock}
            />
            <ColumnZone
                id={`${block.id}:::col2`}
                items={col2Items}
                activeId={activeId}
                onUpdateBlock={onUpdateBlock}
                onSelectBlock={onSelectBlock}
                selectedBlockId={selectedBlockId}
                onDeleteBlock={onDeleteBlock}
            />
        </div>
    );
}
