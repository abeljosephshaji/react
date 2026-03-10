import React from 'react';

export function ButtonBlock({ block, onChange }) {
    const justification = block.align === 'center' ? 'center' :
        block.align === 'flex-end' ? 'flex-end' : 'flex-start';
    return (
        <div
            className="button-block-container"
            style={{
                justifyContent: justification,
            }}
        >
            <button
                className="button-block-btn"
                style={{ backgroundColor: block.color || '#3b82f6' }}
                onClick={() => {
                    if (block.url && block.url !== '#') {
                        window.open(block.url, '_blank');
                    }
                }}
            >
                {block.label || 'Click me'}
            </button>
        </div>
    );
}
