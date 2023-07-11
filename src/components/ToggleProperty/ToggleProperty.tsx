import React from 'react';
import styles from './ToggleProperty.module.scss';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { useTranslation } from "react-i18next";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';

interface TogglePropertyProps {
    label: string;
    value: any;
    options: any[];
    optionLabel: string;
    optionKey: string;
    optionValue: string;
    onChange: (value: any) => void
    className?: string;
}

const ToggleProperty: React.FC<TogglePropertyProps> = ({
    label,
    value,
    options,
    optionLabel,
    optionKey,
    optionValue,
    onChange,
    className
}) => {
    return (
        <div className={className}>
            <div className={styles.root}>
                <div className={styles.label}>
                    {label}
                </div>
                <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={value}
                    onChange={(e, value) => onChange(value)}
                    color="primary"
                >
                    {options.map((item: any) => (
                        <ToggleButton
                            key={item[optionKey]}
                            value={item[optionValue]}
                            className={styles.button}
                        >
                            {item[optionLabel]}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </div>
        </div>
    );
};

interface CountPropertyProps {
    label: string;
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void
    className?: string;
}

export const CountProperty: React.FC<CountPropertyProps> = ({label, value, min = 0, max = 0, onChange, className}) => {
    const {t} = useTranslation();
    return (
        <ToggleProperty
            label={label}
            value={value}
            options={Array.from(Array(max - min + 1).keys()).map(
                item => {
                    const value = item + min;
                    const label = value === 0
                        ? t("no")
                        : value === max ? `${value}+` : value;
                    return {value, label};
                }
            )}
            optionKey="value"
            optionLabel="label"
            optionValue="value"
            onChange={onChange}
            className={className}
        />
    );
};

interface TypePropertyProps {
    label: string;
    value: any;
    options: string[];
    onChange: (value: any) => void
    className?: string;
}

export const TypeProperty: React.FC<TypePropertyProps> = ({label, value, options, onChange, className}) => {
    const {t} = useTranslation();
    return (
        <ToggleProperty
            label={label}
            value={value}
            options={options.map(item => ({value: item, label: t(item)}))}
            optionKey="value"
            optionLabel="label"
            optionValue="value"
            onChange={onChange}
            className={className}
        />
    );
};

interface CommonPropertyProps {
    type: string;
    name: string;
    obj: any;
    min?: number;
    max?: number;
    options?: string[];
    onChange: (name: string, value: any) => void
    className?: string;
}

export const CommonProperty: React.FC<CommonPropertyProps> = ({type, name, obj, min = 0, max = 0, options = [], onChange, className}) => {
    const {t} = useTranslation();
    if (type === "it") {
        return (
            <CountProperty
                label={t(name)}
                value={obj[name] === undefined ? "" : obj[name]}
                min={min}
                max={max || 0}
                onChange={(value: number) => onChange(name, value)}
                className={className}
            />
        );
    }
    if (type === "b") {
        return (
            <ToggleProperty
                label={t(name)}
                value={obj[name] === undefined ? "" : obj[name]}
                options={[{label: t("no"), value: false}, {label: t("yes"), value: true}]}
                optionKey="value"
                optionLabel="label"
                optionValue="value"
                onChange={(value: any) => onChange(name, value)}
                className={className}
            />
        );
    }
    if (type === "i") {
        return (
            <TextField
                label={t(name)}
                size="small"
                className={className}
                type="number"
                value={obj[name] || ""}
                onChange={(e: any) => onChange(name, Number(e.target.value))}
            />
        );
    }
    if (type === "tt") {
        return (
            <TypeProperty
                label={t(name)}
                value={obj[name] || ""}
                options={options}
                onChange={(value: string) => onChange(name, value)}
                className={className}
            />
        );
    }
    return null;
};

export const PROPERTY_TYPES = ['apartment', 'room', 'house', 'land'];
export const BATHROOM_TYPES = ['COMBINED', 'SEPARATED'];
export const REPAIR_TYPES = ['NO', 'COSMETIC', 'EURO', 'DESIGN'];
export const BUILDING_TYPES = ['BRICK', 'PANEL', 'BLOCK', 'MONOLITH', 'WOOD'];
