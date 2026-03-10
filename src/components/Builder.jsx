import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { pointerWithin, rectIntersection } from '@dnd-kit/core';

import { BlockWrapper } from './BlockWrapper';
import { BlockRenderer } from './BlockRenderer';

export function Builder({
    blocks,
    setBlocks,
    selectedBlockId,
    onSelectBlock,
    onUpdateBlock,
    onDeleteBlock
}) {
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Requires 5px of movement before dragging starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    // Custom collision detection strategy
    const customCollisionDetection = (args) => {
        // First, let's see if we are intersecting with any ColumnZones directly
        const pointerCollisions = pointerWithin(args);

        if (pointerCollisions.length > 0) {
            // Prefer ColumnZone hits if we are hovering directly over one
            const zoneCollision = pointerCollisions.find(c => c.id.toString().includes(':::col'));
            if (zoneCollision) {
                return [zoneCollision];
            }
        }

        // Fallback to standard rect intersection for sorting
        return rectIntersection(args);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        setBlocks((prevBlocks) => {
            const newBlocks = JSON.parse(JSON.stringify(prevBlocks)); // Deep clone for simplicity in nested state

            let draggedBlock = null;

            // 1. Remove dragged block from its current location
            const removeItem = (items) => {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].id === activeId) {
                        draggedBlock = { ...items[i] };
                        items.splice(i, 1);
                        return true;
                    }
                    if (items[i].type === 'column' && items[i].children) {
                        if (removeItem(items[i].children.col1)) return true;
                        if (removeItem(items[i].children.col2)) return true;
                    }
                }
                return false;
            };

            removeItem(newBlocks);

            if (!draggedBlock) return prevBlocks;

            // 2. Insert dragged block into new location
            const overData = over.data?.current;

            // Case A: Dropped over a zone (empty or placeholder)
            if (overData?.type === 'ColumnZone') {
                const separator = ':::';
                const lastIndex = overId.lastIndexOf(separator);
                const columnBlockId = overId.substring(0, lastIndex);
                const colKey = overId.substring(lastIndex + separator.length);

                const insertInZone = (items) => {
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].id === columnBlockId) {
                            items[i].children[colKey].push(draggedBlock);
                            return true;
                        }
                        if (items[i].type === 'column' && items[i].children) {
                            if (insertInZone(items[i].children.col1)) return true;
                            if (insertInZone(items[i].children.col2)) return true;
                        }
                    }
                    return false;
                };
                insertInZone(newBlocks);
            }
            // Case B: Dropped over another block (reorder or move to column)
            else {
                const insertAtTarget = (items) => {
                    const idx = items.findIndex(item => item.id === overId);
                    if (idx !== -1) {
                        items.splice(idx, 0, draggedBlock);
                        return true;
                    }
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].type === 'column' && items[i].children) {
                            if (insertAtTarget(items[i].children.col1)) return true;
                            if (insertAtTarget(items[i].children.col2)) return true;
                        }
                    }
                    return false;
                };

                if (!insertAtTarget(newBlocks)) {
                    // Fallback to end of list if target not found
                    newBlocks.push(draggedBlock);
                }
            }

            return newBlocks;
        });
    };

    return (
        <main
            className="builder-canvas"
            onClick={() => onSelectBlock(null)} // Click outside deselects
        >
            <div className="page-container">
                {blocks.length === 0 ? (
                    <div className="empty-state">
                        <p>Your page is empty.</p>
                        <p>Click a block in the sidebar to get started.</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={customCollisionDetection}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={blocks.map(b => b.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {blocks.map((block) => (
                                <BlockWrapper
                                    key={block.id}
                                    block={block}
                                    isSelected={selectedBlockId === block.id}
                                    onSelect={() => onSelectBlock(block)}
                                    onDelete={() => onDeleteBlock(block.id)}
                                >
                                    <BlockRenderer
                                        block={block}
                                        activeId={activeId}
                                        onChange={onUpdateBlock}
                                        onSelectBlock={onSelectBlock}
                                        selectedBlockId={selectedBlockId}
                                        onDeleteBlock={onDeleteBlock}
                                    />
                                </BlockWrapper>
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </main>
    );
}
