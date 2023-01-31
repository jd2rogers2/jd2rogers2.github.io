import React from 'react';

export default function Prefix({ path, time, cmd }) {
    return (
        <div style={{ padding: '0 10px' }}>
            {time ? time + ' ' : ''}{path} ${' '}{cmd || ''}
        </div>
    );
};
