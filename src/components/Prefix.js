import React from 'react';

export default function Prefix({ path, time }) {
    return (
        <>
            {time ? time + ' ' : ''}{path} ${' '}
        </>
    );
};
