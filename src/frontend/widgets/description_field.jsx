import { Textfield ,Stack} from '@forge/react';
import React, { useState, useEffect } from 'react';

const DescriptionField = ({ description, setDescription }) => {
    const [value, setValue] = useState(null);

    useEffect(() => {
        setValue(description);
    }, [description]);

    const handleDescriptionChange = (e) => {
        setValue(e.target.value);
        setDescription(e.target.value);
    };

    return (
            <Textfield value={value} onChange={handleDescriptionChange} width='100%'></Textfield>
    );
};

export default DescriptionField;
