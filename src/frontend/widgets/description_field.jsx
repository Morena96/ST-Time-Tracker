import { Textfield ,Stack} from '@forge/react';
import React from 'react';

const DescriptionField = ({ description, setDescription }) => {

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    return (
            <Textfield value={description} onChange={handleDescriptionChange} width='100%'></Textfield>
    );
};

export default DescriptionField;
