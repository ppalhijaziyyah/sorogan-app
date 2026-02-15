import { useCallback, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const useSoundEffect = () => {
    const { settings } = useContext(AppContext);

    const playSound = useCallback((type) => {
        if (!settings.isSoundEnabled) return;

        let audioSrc;
        if (type === 'correct') {
            audioSrc = '/sounds/correct.mp3';
        } else if (type === 'wrong') {
            audioSrc = '/sounds/wrong.mp3';
        }

        if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play().catch(error => {
                console.warn(`Audio playback failed for ${type}:`, error);
            });
        }
    }, []);

    const playCorrect = useCallback(() => playSound('correct'), [playSound]);
    const playWrong = useCallback(() => playSound('wrong'), [playSound]);

    return { playCorrect, playWrong };
};

export default useSoundEffect;
