import * as React from 'react';

import './Image.css';

export default function Image({imageUrl}){
    const url = 'http://localhost:8090/' + imageUrl;
    return (
        <img src={url} alt={'Some alt text'} />
    )
};
