import * as React from 'react';
import styles from './PlayOnlinePage.module.scss';
import cn from 'classnames';
import { domain, server_port } from '../../config';
import piano_1_C from '../../audio/key01.webm';
import piano_1_Csh from '../../audio/key02.webm';
import piano_1_D from '../../audio/key03.webm';
import piano_1_Dsh from '../../audio/key04.webm';
import piano_1_E from '../../audio/key05.webm';
import piano_1_F from '../../audio/key06.webm';
import piano_1_Fsh from '../../audio/key07.webm';
import piano_1_G from '../../audio/key08.webm';
import piano_1_Gsh from '../../audio/key09.webm';
import piano_1_A from '../../audio/key10.webm';
import piano_1_Ash from '../../audio/key11.webm';
import piano_1_B from '../../audio/key12.webm';
import piano_2_C from '../../audio/key13.webm';
import piano_2_Csh from '../../audio/key14.webm';
import piano_2_D from '../../audio/key15.webm';
import piano_2_Dsh from '../../audio/key16.webm';
import piano_2_E from '../../audio/key17.webm';

const ws = new WebSocket(`ws://${domain}:${server_port}`);
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
    '1_Ash': { audioSrc: piano_1_Ash, eventKey: 'u' },
    '1_B': { audioSrc: piano_1_B, eventKey: 'j' },
    '2_С': { audioSrc: piano_2_C, eventKey: 'k' },
    '2_Csh': { audioSrc: piano_2_Csh, eventKey: 'o' },
    '2_D': { audioSrc: piano_2_D, eventKey: 'l' },
    '2_Dsh': { audioSrc: piano_2_Dsh, eventKey: 'p' },
    '2_E': { audioSrc: piano_2_E, eventKey: ';' },
};

const isBlackKey = (key: string): boolean => key.includes('sh');

export const PlayOnlinePage = () => {
    let blackPos: number = 0;

    const play = (keyVal: string | undefined) => {
        if (keyVal) {
            const audio = new Audio();
            audio.src = pianoKeys[keyVal].audioSrc;
            audio.play();
        }
    };

    const keyPress = (keyVal: string) => {
        if (keyVal) ws.send(keyVal);
    };

    ws.onmessage = (res) => {
        const keyVal = Object.keys(pianoKeys).find((i) => i === res.data);
        play(keyVal);
    };

    document.addEventListener('keypress', (e) => {
        const keyVal = Object.keys(pianoKeys).find((i) => pianoKeys[i].eventKey === e.key);
        if (keyVal) ws.send(keyVal);
    });

    return (
        <div className={styles['keyboard']}>
            {Object.keys(pianoKeys).map((key, index) => {
                const isBlack = isBlackKey(key);

                if (isBlack && (key.includes('Fsh') || key.includes('Csh'))) blackPos++;

                return (
                    <PianoKey
                        key={key}
                        pos={isBlack ? blackPos++ : index}
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
    keyPress: (keyVal: string) => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({ pos, keyVal, keyPress }) => {
    const whiteCount = Object.keys(pianoKeys).filter((key) => !isBlackKey(key)).length;
    const [pressed, setPressed] = React.useState<boolean>(false);
    const { eventKey } = pianoKeys[keyVal];
    const isBlack = isBlackKey(keyVal);

    const style = isBlack && {
        width: `${(100 / whiteCount) * 0.8}%`,
        left: `${(100 / whiteCount) * pos}%`,
    };

    const keyPressAnimation = () => {
        setPressed(true);
        setTimeout(() => setPressed(false), 200);
    };

    const handleClick = () => {
        keyPress(keyVal);
        keyPressAnimation();
    };

    document.addEventListener('keypress', (e) => {
        if (eventKey === e.key) keyPressAnimation();
    });

    return (
        <div
            className={cn(
                styles['key'],
                styles[`key_${isBlack ? 'black' : 'white'}`],
                pressed && styles['key_pressed'],
            )}
            style={style || {}}
            onClick={handleClick}
        >
            {!!eventKey && eventKey.toUpperCase()}
        </div>
    );
};
