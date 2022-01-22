import * as React from 'react';
import styles from './MainPage.module.scss';
import cn from 'classnames';
import { Piano } from 'components/Piano/Piano';

export const MainPage = () => {
    return (
        <div className={styles.root}>
            <Piano />
        </div>
    );
};
