import React, { useRef } from 'react';

export function Sidebar({ onAddBlock, onExport, onImport, canUndo, canRedo, onUndo, onRedo }) {
    const fileInputRef = useRef(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onImport(file);
        }
        // Reset input so same file can be imported again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <aside className="sidebar">
            <div>
                <h2>Page Builder</h2>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1.5rem' }}>
                    Build your notion-like page
                </p>
            </div>

            <div className="sidebar-section">
                <h3>Add Blocks</h3>
                <button className="sidebar-btn" onClick={() => onAddBlock('text')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
                    Text Block
                </button>
                <button className="sidebar-btn" onClick={() => onAddBlock('image')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    Image Block
                </button>
                <button className="sidebar-btn" onClick={() => onAddBlock('button')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="10" rx="3" ry="3"></rect><circle cx="12" cy="12" r="1"></circle></svg>
                    Button Block
                </button>
                <button className="sidebar-btn" onClick={() => onAddBlock('divider')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Divider Line
                </button>
                <button className="sidebar-btn" onClick={() => onAddBlock('column')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="3" x2="12" y2="21"></line></svg>
                    2-Column Layout
                </button>
            </div>

            <div className="sidebar-actions">
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className="action-btn"
                        style={{ flex: 1 }}
                        onClick={onUndo}
                        disabled={!canUndo}
                        title="Undo"
                    >
                        Undo
                    </button>
                    <button
                        className="action-btn"
                        style={{ flex: 1 }}
                        onClick={onRedo}
                        disabled={!canRedo}
                        title="Redo"
                    >
                        Redo
                    </button>
                </div>

                <hr style={{ borderColor: '#374151', margin: '0.5rem 0' }} />

                <button className="action-btn" onClick={onExport}>
                    Export JSON
                </button>
                <button className="action-btn" onClick={handleImportClick}>
                    Import JSON
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="application/json"
                    onChange={handleFileChange}
                />
            </div>
        </aside>
    );
}
