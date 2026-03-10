import React, { useRef, useEffect } from 'react';

export function TextBlock({ block, onChange }) {
    const contentRef = useRef(null);

    useEffect(() => {
        // Only update innerHTML if it's different to prevent cursor jumping
        if (contentRef.current && contentRef.current.innerHTML !== block.content) {
            contentRef.current.innerHTML = block.content;
        }
    }, [block.content]);

    const handleInput = (e) => {
        // ContentEditable triggers this on every keystroke
        onChange(block.id, { content: e.target.innerHTML });
    };

    return (
        <div
            style={{
                textAlign: block.align,
                fontSize: block.fontSize,
            }}
        >
            <div
                ref={contentRef}
                className="text-block-content"
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onBlur={handleInput}
                placeholder="Type something..."
            />
        </div>
    );
}
