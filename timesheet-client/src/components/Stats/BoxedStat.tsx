import React from "react";
import './styles.css';
import { Group } from "@mantine/core";

interface BoxedStatProps {
    size?: 'small' | 'big',
    variant?: 'circle' | 'box',
    stat: string,
    label: string
}

function BoxedStat({size, variant, stat, label}: BoxedStatProps):JSX.Element {
    const rendered_size = (size == 'small') ? 'small' : 'big';

    return (
        <Group className={`boxed-stat ${size}`} gap={10}>
            <label>{label}</label>
            <div className={`stat-container ${size} ${variant}`}>{stat}</div>
        </Group>
    )
}

export default BoxedStat;