import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Builder } from './components/Builder';
import { SettingsPanel } from './components/SettingsPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useUndoRedo } from './hooks/useUndoRedo';
import { exportJSON } from './utils/exportJSON';
import { importJSON } from './utils/importJSON';
import { createBlock } from './utils/blockFactory';
import './index.css';

function App() {
    // Persistence config
    const LOCAL_STORAGE_KEY = 'advanced-page-builder-data';
    const [initialData, setInitialData] = useLocalStorage(LOCAL_STORAGE_KEY, []);

    // History management
    const {
        state: blocks,
        set: setBlocksHistory,
        undo,
        redo,
        canUndo,
        canRedo,
        reset
    } = useUndoRedo(initialData);

    // Sync to local storage when blocks change
    useEffect(() => {
        setInitialData(blocks);
    }, [blocks, setInitialData]);

    // Selected state
    const [selectedBlockId, setSelectedBlockId] = useState(null);

    const selectedBlock = blocks.find(b => b.id === selectedBlockId) || null;

    // Actions
    const handleAddBlock = (type) => {
        const newBlock = createBlock(type);
        const newBlocks = [...(blocks || []), newBlock];
        setBlocksHistory(newBlocks);
        setSelectedBlockId(newBlock.id);
    };

    const handleUpdateBlock = useCallback((id, updates) => {
        setBlocksHistory((prevBlocks) => {
            const updateBlockInArray = (blocksArray) => {
                return blocksArray.map(block => {
                    if (block.id === id) {
                        // Special handling for adding children to columns
                        if (updates.action === 'add_child') {
                            const newChild = createBlock(updates.type);
                            const newChildren = { ...block.children };
                            newChildren[updates.colKey] = [...(newChildren[updates.colKey] || []), newChild];
                            return { ...block, children: newChildren };
                        }
                        return { ...block, ...updates };
                    }
                    if (block.type === 'column' && block.children) {
                        return {
                            ...block,
                            children: {
                                col1: updateBlockInArray(block.children.col1 || []),
                                col2: updateBlockInArray(block.children.col2 || [])
                            }
                        };
                    }
                    return block;
                });
            };
            return updateBlockInArray(prevBlocks);
        });
    }, [setBlocksHistory]);

    const handleDeleteBlock = useCallback((id) => {
        setBlocksHistory((prevBlocks) => {
            const deleteBlockFromArray = (blocksArray) => {
                const filtered = blocksArray.filter(block => block.id !== id);
                return filtered.map(block => {
                    if (block.type === 'column' && block.children) {
                        return {
                            ...block,
                            children: {
                                col1: deleteBlockFromArray(block.children.col1 || []),
                                col2: deleteBlockFromArray(block.children.col2 || [])
                            }
                        };
                    }
                    return block;
                });
            };
            return deleteBlockFromArray(prevBlocks);
        });

        if (selectedBlockId === id) {
            setSelectedBlockId(null);
        }
    }, [setBlocksHistory, selectedBlockId]);

    const handleSelectBlock = useCallback((block) => {
        setSelectedBlockId(block ? block.id : null);
    }, []);

    const handleSetBlocks = useCallback((newBlocksUpdater) => {
        if (typeof newBlocksUpdater === 'function') {
            setBlocksHistory(newBlocksUpdater(blocks));
        } else {
            setBlocksHistory(newBlocksUpdater);
        }
    }, [blocks, setBlocksHistory]);

    const handleExport = () => {
        exportJSON(blocks, 'my-page.json');
    };

    const handleImport = async (file) => {
        try {
            const { importJSON } = await import('./utils/importJSON');
            const data = await importJSON(file);
            if (Array.isArray(data)) {
                reset(data);
                setSelectedBlockId(null);
            } else {
                alert("Invalid JSON format. Expected an array of blocks.");
            }
        } catch (error) {
            alert("Error parsing JSON: " + error.message);
        }
    };

    return (
        <div className="app-container">
            <Sidebar
                onAddBlock={handleAddBlock}
                onExport={handleExport}
                onImport={handleImport}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undo}
                onRedo={redo}
            />

            <Builder
                blocks={blocks}
                setBlocks={handleSetBlocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={handleSelectBlock}
                onUpdateBlock={handleUpdateBlock}
                onDeleteBlock={handleDeleteBlock}
            />

            <SettingsPanel
                selectedBlock={selectedBlock}
                onUpdateBlock={handleUpdateBlock}
                onDeleteBlock={handleDeleteBlock}
            />
        </div>
    );
}

export default App;
