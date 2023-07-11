import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import type { User, UsersFilter } from '../../utils/types/listingTypes';
import { getUsers } from '../../services/api/listingApi';
import styles from './UsersPage.module.scss';
import Button from '@mui/material/Button';
import useTheme from '@mui/material/styles/useTheme';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { SelectRoleDialog } from "../../components/SelectRoleDialog";
import { SearchBar } from '../../components/SearchBar';

const LIMIT = 5;

interface UserProps {
	user: User;
    onChange?: (user: User) => void;
}

const UserRow: React.FC<UserProps> = ({user, onChange}) => {
    const {t} = useTranslation();
    const theme = useTheme();
    const [selectRoleDialogVisible, setSelectRoleDialogVisible] = useState(false);
    const colors: any = {
		admin: [theme.palette.error.main, theme.palette.error.dark],
		moderator: [theme.palette.warning.main, theme.palette.warning.dark],
		user: [theme.palette.success.main, theme.palette.success.dark],
		agent: [theme.palette.primary.main, theme.palette.primary.dark]
    };
    const [c1, c2] = colors[user.role] || [theme.palette.primary.main, theme.palette.primary.dark];
    const roleStyle = {
        width: "156px",
        backgroundColor: c1,
        "&:hover": {
            backgroundColor: c2
        }
	};
    return (
        <TableRow>
            <TableCell>
                {user.email}
            </TableCell>
            <TableCell>
                {user.full_name}
            </TableCell>
            <TableCell>
                {user.phone}
            </TableCell>
            <TableCell>
                <Button
                    sx={roleStyle}
                    variant="contained"
                    onClick={() => setSelectRoleDialogVisible(true)}
                >
                    {t(`role_list.${user.role}`)}
                </Button>
            </TableCell>
            {selectRoleDialogVisible && (
                <SelectRoleDialog
                    user={user}
                    onChange={user => {
                        setSelectRoleDialogVisible(false);
                        onChange && onChange(user);
                    }}
                    onCancel={() => setSelectRoleDialogVisible(false)}
                />
            )}
        </TableRow>
    );
};

export const UsersPage = () => {
    const {t} = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<UsersFilter>({});

    useEffect(() => {
        const fetch = async () => {
            setUsers(await getUsers(0, LIMIT, filter));
        };
        fetch();
    }, [filter]);

    const handleMoreClick = async () => {
        const newUsers = await getUsers(users.length ? users[users.length - 1].id : 0, LIMIT, filter);
        if (newUsers.length > 0) {
            setUsers([...users, ...newUsers]);
        }
    };

    const handleFilterAppy = async (filter: UsersFilter) => {
        setUsers(await getUsers(0, LIMIT, filter));
        setFilter(filter);
    };

    const onChange = (user: User) => {
        setUsers(users.map(item => item.id === user.id ? user : item));
    };

    return (
        <div className={styles.usersPage}>
            <SearchBar filter={filter} onFilterAppy={handleFilterAppy} />
            {users.length > 0 && (
                <div className={styles.users}>
                    <TableContainer
                        component={Paper}
                        sx={{
                            borderRadius: "16px"
                        }}
                    >
                        <Table>
                            <TableBody>
                                {users.map(user => <UserRow key={user.id} user={user} onChange={onChange} />)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
            <div className={styles.loadMoreButton}>
                <Button onClick={handleMoreClick} variant="text">
                    {t("more")}
                </Button>
            </div>
        </div>
    );
};
