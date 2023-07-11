import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import TextField from '@mui/material/TextField';
import styles from './SearchBar.module.scss';
import TuneIcon from '@mui/icons-material/Tune';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import type { FilterDialogProps } from '../../utils/types/listingTypes';
import Badge from '@mui/material/Badge';
import {pickBy, isEmpty} from "lodash";
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from '@mui/icons-material/Delete';

interface SearchBarProps {
    filter: any;
    onFilterAppy: (filter: any) => void;
    FilterDialog?: React.FC<FilterDialogProps>;
    RightControls?: React.FC
}

export const SearchBar: React.FC<SearchBarProps> = ({ filter, onFilterAppy, FilterDialog, RightControls }) => {
    const {t} = useTranslation();
    const [query, setQuery] = useState(filter.query || "");
    const [filterDialogVisible, setFilterDialogVisible] = useState(false);

    const handleSearch = () => onFilterAppy(query === "" ? pickBy(filter, (value, key) => key !== "query") : {...filter, query});

    const extra = pickBy(filter, (value, key) => key !== "query");
    const extraIsEmpty = isEmpty(extra);

    return (
        <div className={styles.searchBar}>
            <div className={styles.container}>
                {FilterDialog !== undefined && (
                    <Badge color="primary" variant="dot" invisible={extraIsEmpty}>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => setFilterDialogVisible(true)}
                            className={styles.filterIcon}
                            disableRipple
                        >
                            <TuneIcon />
                            <span>{t("search_bar.filters")}</span>
                        </IconButton>
                    </Badge>
                )}
                <TextField
                    size="small"
                    placeholder={t("search_bar.search_placeholder")!}
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    onKeyPress={e => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <>
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => {
                                            setQuery("");
                                            onFilterAppy(pickBy(filter, (value, key) => key !== "query"));
                                        }}
                                        className={styles.clearIcon}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </InputAdornment>
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={handleSearch}
                                        className={styles.searchIcon}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            </>
                        )
                    }}
                />
                {RightControls !== undefined && <RightControls />}
                {filterDialogVisible && FilterDialog !== undefined && (
                    <FilterDialog
                        filter={filter}
                        onAccept={filter => {
                            setFilterDialogVisible(false);
                            onFilterAppy(query === "" ? pickBy(filter, (value, key) => key !== "query") : {...filter, query});
                        }}
                        onClose={() => setFilterDialogVisible(false)}
                    />
                )}
            </div>
        </div>
    );
};
