import React, { useRef } from 'react';

export function ImageBlock({ block, onChange }) {
    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create a local object URL for immediate display
            const imageUrl = URL.createObjectURL(file);
            onChange(block.id, { url: imageUrl });
        }
    };

    return (
        <div
            className="image-block-container"
            style={{
                alignItems: block.align === 'center' ? 'center' :
                    block.align === 'flex-end' ? 'flex-end' : 'flex-start',
            }}
        >
            {block.url ? (
                <img
                    src={block.url}
                    alt="User uploaded block content"
                    style={{ width: block.width || '100%' }}
                />
            ) : (
                <div className="image-placeholder" onClick={handleImageClick}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    <span>Click to upload image</span>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="image-upload-input"
                accept="image/*"
            />
        </div>
    );
}
