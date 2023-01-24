import React from 'react';

export default function Prefix({ path, time, cmd }) {
    return (
        <div style={{ paddingLeft: '10px' }}>
            {time ? time + ' ' : ''}{path} ${' '}{cmd || ''}
        </div>
    );
};
