import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import type { ListingsFilter, FilterDialogProps } from '../../utils/types/listingTypes';
import styles from './ListingsFilterDialog.module.scss';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DialogTitle } from '@mui/material';
import { CommonProperty, PROPERTY_TYPES } from '../ToggleProperty';

interface FromToProps {
    name: string;
    currentFilter: any;
    updateFilter: (name: string, value: any) => void;
}

const FromTo: React.FC<FromToProps> = ({name, currentFilter, updateFilter}) => {
    const {t} = useTranslation();
    const fromName = `${name}_from`;
    const toName = `${name}_to`;
    return (
        <div className={styles.row}>
            <div className={styles.label}>
                {t(name)}
            </div>
            <TextField
                sx={{
                    fieldset: {
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0
                    },
                    width: "128px"
                }}
                type="number"
                size="small"
                label={t("from")}
                value={currentFilter[fromName] === undefined ? "" : currentFilter[fromName]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFilter(fromName, Number(e.target.value) || 0)}
            />
            <TextField
                sx={{
                    fieldset: {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0
                    },
                    width: "128px"
                }}
                type="number"
                size="small"
                label={t("to")}
                value={currentFilter[toName] === undefined ? "" : currentFilter[toName]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFilter(toName, Number(e.target.value) || 0)}
            />
        </div>
    )
};

export const ListingsFilterDialog: React.FC<FilterDialogProps> = ({ filter, onAccept, onClose }) => {
    const {t} = useTranslation();
    const [currentFilter, setCurrentFilter] = useState(filter);
    const updateFilter = (name: string, value: any) => {
        const newFilter: ListingsFilter = {...currentFilter};
        if (value === 0 || value === null) {
            delete (newFilter as any)[name];
        } else {
            (newFilter as any)[name] = value;
        }
        setCurrentFilter(newFilter);
    };
    return (
		<Dialog open onClose={onClose}>
            <DialogTitle>{t("filter")}</DialogTitle>
			<DialogContent>
                <div className={styles.listingsFilterDialog}>
                    <FromTo name="price" currentFilter={currentFilter} updateFilter={updateFilter} />
                    <CommonProperty
                        type="tt"
                        name="type"
                        options={PROPERTY_TYPES}
                        obj={currentFilter}
                        onChange={updateFilter}
                    />
                    <FromTo name="rooms" currentFilter={currentFilter} updateFilter={updateFilter} />
                    <FromTo name="area" currentFilter={currentFilter} updateFilter={updateFilter} />
                    <FromTo name="floor" currentFilter={currentFilter} updateFilter={updateFilter} />
                    <FromTo name="total_floors" currentFilter={currentFilter} updateFilter={updateFilter} />
                    <DialogActions>
                        <Button variant="text" onClick={onClose}>
                            {t("cancel")}
                        </Button>
                        <Button variant="outlined" onClick={() => setCurrentFilter({})}>
                            {t("clear")}
                        </Button>
                        <Button variant="contained" onClick={() => onAccept(currentFilter)}>
                            {t("apply")}
                        </Button>
                    </DialogActions>
                </div>
			</DialogContent>
		</Dialog>
    );
};
