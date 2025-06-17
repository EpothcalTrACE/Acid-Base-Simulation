// src/components/ui.js
import React from 'react';

export const Button = ({ children, ...props }) => (
    <button {...props} style={{ padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px' }}>
        {children}
    </button>
);

export const Card = ({ children }) => (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        {children}
    </div>
);

export const CardContent = ({ children }) => <div>{children}</div>;

export const Input = (props) => (
    <input {...props} style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }} />
);
