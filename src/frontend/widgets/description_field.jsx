import { Textfield } from '@forge/react';
import React, { useState, useEffect } from 'react';

const DescriptionField = ({ description, setDescription, onBlur }) => {
    const [value, setValue] = useState(null);

    useEffect(() => {
        setValue(description);
    }, [description]);

    const handleDescriptionChange = (e) => {
        setValue(e.target.value);
        setDescription(e.target.value);
    };

    return (
        <Textfield
            value={value}
            onChange={handleDescriptionChange}
            onBlur={onBlur}
            width='100%'>

        </Textfield>
    );
};

export default DescriptionField;
