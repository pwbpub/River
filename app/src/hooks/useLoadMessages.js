import { useState, useEffect } from 'react';

const messages = [
    {text: "Magicians at Work...Please Wait", duration: 4000},
    {text: "A Wizard is never late...", duration: 5000},
    {text: "He arrives precisely when he means to.", duration: 6500},
    {text: "We swear this never happens!", duration: 4000},
];

const useLoadMessages = (loading) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!loading){
            setCurrentIndex(0);
            return;
        }

        const timerId = setTimeout(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, messages[currentIndex].duration);

        // Cleanup the timer on unmount or when dependencies change
        return () => clearTimeout(timerId);
    }, [loading, currentIndex]); 

    return messages[currentIndex].text;
};

export default useLoadMessages;