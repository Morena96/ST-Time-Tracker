const SuccessMessage = ({ message, onClose }) => {
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
        <SectionMessage appearance="success">
            <Text>{message}</Text>
        </SectionMessage>
    );
};

export default SuccessMessage;