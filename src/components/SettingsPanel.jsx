import React from 'react';

export function SettingsPanel({ selectedBlock, onUpdateBlock, onDeleteBlock }) {
    if (!selectedBlock) {
        return (
            <aside className="settings-panel">
                <h2>Settings</h2>
                <div className="empty-settings">
                    Select a block to edit its properties
                </div>
            </aside>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdateBlock(selectedBlock.id, { [name]: value });
    };

    const renderBlockSettings = () => {
        switch (selectedBlock.type) {
            case 'text':
                return (
                    <>
                        <div className="setting-group">
                            <label>Alignment</label>
                            <select name="align" value={selectedBlock.align || 'left'} onChange={handleChange}>
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                                <option value="justify">Justify</option>
                            </select>
                        </div>
                        <div className="setting-group">
                            <label>Font Size</label>
                            <select name="fontSize" value={selectedBlock.fontSize || '16px'} onChange={handleChange}>
                                <option value="12px">Small (12px)</option>
                                <option value="16px">Normal (16px)</option>
                                <option value="20px">Large (20px)</option>
                                <option value="24px">Heading 3 (24px)</option>
                                <option value="32px">Heading 2 (32px)</option>
                                <option value="40px">Heading 1 (40px)</option>
                            </select>
                        </div>
                    </>
                );

            case 'image':
                return (
                    <>
                        <div className="setting-group">
                            <label>Image URL</label>
                            <input
                                type="text"
                                name="url"
                                value={selectedBlock.url || ''}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div className="setting-group">
                            <label>Width</label>
                            <select name="width" value={selectedBlock.width || '100%'} onChange={handleChange}>
                                <option value="25%">25%</option>
                                <option value="50%">50%</option>
                                <option value="75%">75%</option>
                                <option value="100%">100%</option>
                            </select>
                        </div>
                        <div className="setting-group">
                            <label>Alignment</label>
                            <select name="align" value={selectedBlock.align || 'center'} onChange={handleChange}>
                                <option value="flex-start">Left</option>
                                <option value="center">Center</option>
                                <option value="flex-end">Right</option>
                            </select>
                        </div>
                    </>
                );

            case 'button':
                return (
                    <>
                        <div className="setting-group">
                            <label>Label</label>
                            <input
                                type="text"
                                name="label"
                                value={selectedBlock.label || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="setting-group">
                            <label>URL (Link)</label>
                            <input
                                type="text"
                                name="url"
                                value={selectedBlock.url || ''}
                                onChange={handleChange}
                                placeholder="https://"
                            />
                        </div>
                        <div className="setting-group">
                            <label>Color</label>
                            <input
                                type="color"
                                name="color"
                                value={selectedBlock.color || '#3b82f6'}
                                onChange={handleChange}
                                style={{ height: '40px', padding: '0.2rem' }}
                            />
                        </div>
                        <div className="setting-group">
                            <label>Alignment</label>
                            <select name="align" value={selectedBlock.align || 'center'} onChange={handleChange}>
                                <option value="flex-start">Left</option>
                                <option value="center">Center</option>
                                <option value="flex-end">Right</option>
                            </select>
                        </div>
                    </>
                );

            case 'divider':
                return (
                    <div className="empty-settings">
                        No settings for divider block
                    </div>
                );

            case 'column':
                return (
                    <>
                        <div className="setting-group">
                            <label>Column Proportion</label>
                            <select
                                name="proportion"
                                value={selectedBlock.proportion || '1fr 1fr'}
                                onChange={handleChange}
                            >
                                <option value="1fr 1fr">50% / 50%</option>
                                <option value="1fr 2fr">33% / 67%</option>
                                <option value="2fr 1fr">67% / 33%</option>
                                <option value="1fr 3fr">25% / 75%</option>
                                <option value="3fr 1fr">75% / 25%</option>
                            </select>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <aside className="settings-panel">
            <h2>Settings ({selectedBlock.type})</h2>

            {renderBlockSettings()}

            <button
                className="delete-btn"
                onClick={() => onDeleteBlock(selectedBlock.id)}
            >
                Delete Block
            </button>
        </aside>
    );
}
