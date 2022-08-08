import React from 'react';
import { Link } from 'react-router-dom';

const Cats = ({cat}) => {
    return (
            <Link className="btn btn-primary py-1 m-1 text-capitalize" to={`/?cat=${cat.name}`} role="button">{cat.name}</Link>
    );
};

export default Cats;