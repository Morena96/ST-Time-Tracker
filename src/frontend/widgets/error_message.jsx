import { SectionMessage, Text } from '@forge/react';
import React, { useEffect, useState } from 'react';

const ErrorMessage = ({ message,onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <SectionMessage appearance="error">
            <Text>{message}</Text>
        </SectionMessage>
    );
};

export default ErrorMessage;