import * as React from 'react';
import styles from './PlayOnlinePage.module.scss';
import cn from 'classnames';
import piano_1_C from '../../audio/key08.webm';
import piano_1_Csh from '../../audio/key09.webm';
import piano_1_D from '../../audio/key10.webm';
import piano_1_Dsh from '../../audio/key11.webm';
import piano_1_E from '../../audio/key12.webm';
import piano_1_F from '../../audio/key13.webm';
import piano_1_Fsh from '../../audio/key14.webm';
import piano_1_G from '../../audio/key15.webm';
import piano_1_Gsh from '../../audio/key16.webm';
import piano_1_A from '../../audio/key17.webm';
// import piano_1_Ash from '../../audio/key18.webm';
// import piano_1_B from '../../audio/key19.webm';
// import piano_2_C from '../../audio/key20.webm';
// import piano_2_Csh from '../../audio/key21.webm';
// import piano_2_D from '../../audio/key22.webm';
// import piano_2_Dsh from '../../audio/key23.webm';
// import piano_2_E from '../../audio/key24.webm';

const ws = new WebSocket('ws://virtual_piano:80');
ws.binaryType = 'arraybuffer';

type keyType = { audioSrc: string; eventKey: string; isBlack?: boolean };

const pianoKeys: Record<string, keyType> = {
    '1_C': { audioSrc: piano_1_C, eventKey: 'a' },
    '1_Csh': { audioSrc: piano_1_Csh, eventKey: 'w' },
    '1_D': { audioSrc: piano_1_D, eventKey: 's' },
    '1_Dsh': { audioSrc: piano_1_Dsh, eventKey: 'e' },
    '1_E': { audioSrc: piano_1_E, eventKey: 'd' },
    '1_F': { audioSrc: piano_1_F, eventKey: 'f' },
    '1_Fsh': { audioSrc: piano_1_Fsh, eventKey: 't' },
    '1_G': { audioSrc: piano_1_G, eventKey: 'g' },
    '1_Gsh': { audioSrc: piano_1_Gsh, eventKey: 'y' },
    '1_A': { audioSrc: piano_1_A, eventKey: 'h' },
};

const isBlackKey = (key: string): boolean => key.includes('sh');

export const PlayOnlinePage = () => {
    const whiteKeysCount = Object.keys(pianoKeys).filter((key) => !isBlackKey(key)).length;
    let blackPos: number = 0;

    const play = (keyVal: string | undefined) => {
        if (keyVal) {
            const audio = new Audio();
            audio.src = pianoKeys[keyVal].audioSrc;
            audio.play();
        }
    };

    const keyPress = (keyVal: string) => play(keyVal);

    ws.onmessage = (res) => {
        const keyVal = Object.keys(pianoKeys).find((i) => i === res.data);
        play(keyVal);
    };

    document.addEventListener('keypress', (e) => {
        const keyVal = Object.keys(pianoKeys).find((i) => pianoKeys[i].eventKey === e.key);
        if (keyVal) ws.send(keyVal);
    });

    return (
        <div className={styles['keyboard-wrapper']}>
            {Object.keys(pianoKeys).map((key, index) => {
                const isBlack = isBlackKey(key);

                if (isBlack && (key.includes('Csh') || key.includes('Fsh'))) blackPos++;

                return (
                    <PianoKey
                        key={key}
                        pos={isBlack ? blackPos++ : index}
                        whiteKeysCount={whiteKeysCount}
                        keyVal={key}
                        keyPress={keyPress}
                    />
                );
            })}
        </div>
    );
};

interface PianoKeyProps {
    pos: number;
    keyVal: string;
    whiteKeysCount: number;
    keyPress: (keyVal: string) => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({ pos, keyVal, whiteKeysCount, keyPress }) => {
    const [pressed, setPressed] = React.useState<boolean>(false);
    const { eventKey } = pianoKeys[keyVal];
    const isBlack = isBlackKey(keyVal);
    const keyStyles = isBlack
        ? {
              width: `${(100 / whiteKeysCount) * 0.8}%`,
              left: `${(100 / whiteKeysCount) * pos}%`,
              transform: 'translateX(-50%)',
              zIndex: 10,
          }
        : {};

    const keyPressAnimation = () => {
        setPressed(true);
        setTimeout(() => setPressed(false), 300);
    };

    const handleClickKey = () => {
        keyPress(keyVal);
        keyPressAnimation();
    };

    document.addEventListener('keypress', (e) => {
        if (eventKey === e.key) keyPressAnimation();
    });

    return (
        <div
            className={cn(
                styles['key-element'],
                styles[`key-element_${isBlack ? 'black' : 'white'}`],
                pressed && styles['key-element_pressed'],
            )}
            style={keyStyles}
            onClick={handleClickKey}
        >
            {!!eventKey && eventKey.toUpperCase()}
        </div>
    );
};
