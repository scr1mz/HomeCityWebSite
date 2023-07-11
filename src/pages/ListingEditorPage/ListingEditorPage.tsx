import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ListingEditorPage.module.scss';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createObject, updateObject, uploadImage, deleteImage, getListingById, getAddrs } from "../../services/api/listingApi";
import { TunedCarousel } from '../../components/TunedCarousel';
import type { Listing, Location } from '../../utils/types/listingTypes';
import { LoginDialog } from '../../components/LoginDialog';
import { useCookies } from 'react-cookie';
import useLocalStorageState from "use-local-storage-state";
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {v4 as uuid4} from "uuid";
import { debounce } from '@mui/material/utils';
import Autocomplete from '@mui/material/Autocomplete';
import { CommonProperty, BATHROOM_TYPES, REPAIR_TYPES, BUILDING_TYPES } from '../../components/ToggleProperty';
import InputAdornment from '@mui/material/InputAdornment';

const fetch = async (name: string, city: string, callback: (locations: Location[]) => void) => {callback(await getAddrs(name, city))};
const fetchWithDelay = debounce(fetch, 500);

export const FIELDS_BY_PROPERTY_TYPE: any = {
    apartment: ["rooms", "floor", "total_floors", "bathroom_type", "bathrooms_count", "loggias_count", "repair_type", "building_type", "elevators_count", "has_cargo_elevator", "has_parking"],
    room: ["floor", "total_floors", "bathroom_type", "bathrooms_count", "loggias_count", "repair_type", "building_type", "elevators_count", "has_cargo_elevator", "has_parking"],
    house: ["rooms", "total_floors", "bathroom_type", "bathrooms_count", "repair_type", "building_type", "has_parking", "has_electricity", "has_gas", "has_water"],
    land: ["has_electricity", "has_gas", "has_water"]
};

export const ATTRS_BY_PROPERTY_NAME: any = {
    floor: {type: "i"},
    total_floors: {type: "i"},
    rooms: {type: "it", min: 1, max: 5},
    bathroom_type: {type: "tt", options: BATHROOM_TYPES},
    bathrooms_count: {type: "it", max: 3},
    loggias_count: {type: "it", max: 3},
    repair_type: {type: "tt", options: REPAIR_TYPES},
    building_type: {type: "tt", options: BUILDING_TYPES},
    elevators_count: {type: "it", max: 3},
    has_cargo_elevator: {type: "b"},
    has_parking: {type: "b"},
    has_electricity: {type: "b"},
    has_gas: {type: "b"},
    has_water: {type: "b"}
};

interface ListingEditorPageProps {
    listing?: any;
    onSave?: (listing: Listing) => void;
    onCancel?: () => void;
}

export type {ListingEditorPageProps};

export const ListingEditorPage: React.FC<ListingEditorPageProps> = ({listing, onSave, onCancel}) => {
    const {t} = useTranslation();
    const [currentListing, setCurrentListing] = useState<any>(listing || {images: []});
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const imageInputRef = useRef(null);
    const [cookies] = useCookies(["id"]);
    const [imageIndex, setImageIndex] = useState(0);
    const [location] = useLocalStorageState<Location>("location");
    const coords = currentListing.latitude && currentListing.longitude
        ? [currentListing.latitude, currentListing.longitude]
        : [];
    const [center, setCenter] = useState<number[] | undefined>(coords.length > 0 ? coords : location!.coords);
    const [zoom, setZoom] = useState<number>(coords.length > 0 ? 17 : 9);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
    const { id } = useParams();
    const [currentAddress, setCurrentAddress] = useState(currentListing.address || "");
    const [options, setOptions] = useState<Location[]>([]);
    const fields = FIELDS_BY_PROPERTY_TYPE[currentListing.property_type] || [];

    useEffect(() => {
        if (listing === undefined && id !== undefined) {
            const fetch = async () => {
                const listing = await getListingById(id);
                setCurrentAddress(listing.address || "");
                setCurrentListing(listing);
                if (listing.latitude && listing.longitude) {
                    setCenter([listing.latitude, listing.longitude]);
                    setZoom(17);
                }
                setError("");
                setImageIndex(0);
                setRemovedImageIds([]);
            };
            fetch();
        } else {
            const newListing = listing || {images: []};
            setCurrentAddress(newListing.address || "");
            setCurrentListing(newListing);
            const coords = newListing.latitude && newListing.longitude
                ? [newListing.latitude, newListing.longitude]
                : [];
            setCenter(coords.length > 0 ? coords : location!.coords);
            setZoom(coords.length > 0 ? 17 : 9);
            setError("");
            setImageIndex(0);
            setRemovedImageIds([]);
        }
    }, [listing, id, location]);

    useEffect(() => {
        const address = currentListing.address || "";
        if (address !== currentAddress) {
            setCurrentAddress(address);
            fetchWithDelay(address, location!.name, (locations: Location[]) => {
                if (locations.length > 0) {
                    setZoom(17);
                    setCenter(locations[0].coords);
                    const {coords: [latitude, longitude]} = locations[0];
                    setCurrentListing({
                        ...currentListing,
                        latitude,
                        longitude
                    });
                }
                setOptions(locations);
            });
        }
    }, [currentListing, currentAddress, location]);

    const handleSave = async () => {
        setError("");
        if (!currentListing.address || !currentListing.description || !currentListing.price || !currentListing.area) {
            setError(t("required_fields_not_filled") as string);
            return;
        }
        let newListing: Listing | null;
        if (!currentListing.id) {
            newListing = await createObject(currentListing);
            if (newListing === null) {
                setError(t("something_went_wrong") as string);
                return;
            }
        } else {
            newListing = await updateObject(currentListing);
            if (newListing === null) {
                setError(t("something_went_wrong") as string);
                return;
            }
        }
        newListing.images = currentListing.images;
        for (let i = 0; i < newListing.images.length; i++) {
            if (newListing.images[i].file) {
                const res = await uploadImage(newListing.id, newListing.images[i].file);
                if (res === null) {
                    setError(t("something_went_wrong") as string);
                    return;
                }
                newListing.images[i] = res;
            }
        }
        for (const removedImageId of removedImageIds) {
            const res = await deleteImage(newListing.id, removedImageId);
            if (res === null) {
                setError(t("something_went_wrong") as string);
                return;
            }
        }
        setCurrentListing({...newListing, images: [...newListing.images]});
        onSave && onSave(newListing);
    };

    const handleChange = (name: string, value: any) => {
        setCurrentListing({...currentListing, [name]: value});
    };

    const onImageInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setError("");
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result === null) {
                    setError(t("something_went_wrong") as string);
                    return;
                }
                const dataUrl = "data:image/;base64," + (reader.result as string).split(",")[1];
                currentListing.images.splice(imageIndex, 0, {id: uuid4(), image_url: dataUrl, file});
                setCurrentListing({...currentListing, images: [...currentListing.images]});
            };
            reader.readAsDataURL(file);
        }
        (imageInputRef as any).current.value = "";
    };

    const onImageMenuClose = () => {
        setMenuAnchor(null);
    };

    const onImageMenuOpen = (e: any) => {
        setMenuAnchor(e.currentTarget);
    };

    const onImageAddClick = () => {
        onImageMenuClose();
        (imageInputRef as any).current.click();
    };

    const onImageRemoveClick = () => {
        onImageMenuClose();
        const removedImageId = currentListing.images[imageIndex].id;
        if (typeof removedImageId === "number") {
            setRemovedImageIds([...removedImageIds, removedImageId]);
        }
        currentListing.images.splice(imageIndex, 1);
        setCurrentListing({...currentListing, images: [...currentListing.images]});
    };

    return (
        <div className={styles.listingEditorPage}>
            {cookies.id === undefined && <LoginDialog onClose={() => navigate("/")} />}
            <h1>{!currentListing.id ? t("create_listing") : t("edit_listing")}</h1>
            <input
                type="file"
                accept=".jpg, .jpeg"
                style={{display: "none"}}
                ref={imageInputRef}
                onChange={onImageInputChange}
            />
            <div className={styles.images}>
                <TunedCarousel
                    title={t("create_listing")}
                    images={currentListing.images}
                    onClick={currentListing.images.length > 0 ? undefined : onImageAddClick}
                    onMenuClick={currentListing.images.length > 0 ? onImageMenuOpen : undefined}
                    imageIndex={imageIndex}
                    setImageIndex={setImageIndex}
                />
            </div>
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={onImageMenuClose}
            >
                <MenuItem onClick={onImageAddClick}>
                    <ListItemIcon>
                        <AddIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText>
                        {t("add")}
                    </ListItemText>
                </MenuItem>
                {currentListing.images.length > 0 && (
                    <MenuItem onClick={onImageRemoveClick}>
                        <ListItemIcon>
                            <DeleteIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText>
                            {t("remove")}
                        </ListItemText>
                    </MenuItem>
                )}
            </Menu>
            <TextField
                label={t("type")}
                size="small"
                className={styles.field}
                value={t(currentListing.property_type)}
                disabled
            />
            <Autocomplete
                noOptionsText={t("not_found")}
                options={options}
                getOptionLabel={option => option.name}
                value={{name: currentListing.address || "", coords: []}}
                size="small"
                className={styles.field}
                onInputChange={(event, text) => {
                    handleChange("address", text);
                }}
                renderInput={params => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label={t("address") + "*"}
                    />
                )}
            />
            <TextField
                label={t("description") + "*"}
                multiline
                minRows={2}
                maxRows={13}
                size="small"
                className={styles.field}
                value={currentListing.description || ""}
                onChange={e => handleChange("description", e.target.value)}
            />
            <TextField
                label={t("price") + "*"}
                size="small"
                className={styles.field}
                type="number"
                value={currentListing.price || ""}
                onChange={e => handleChange("price", Number(e.target.value))}
                InputProps={{
                    endAdornment: <InputAdornment position="end">₽</InputAdornment>
                }}
            />
            <TextField
                label={t("area") + "*"}
                size="small"
                className={styles.field}
                type="number"
                value={currentListing.area || ""}
                onChange={e => handleChange("area", Number(e.target.value))}
                InputProps={{
                    endAdornment: <InputAdornment position="end">{t("m2")}</InputAdornment>
                }}
            />
            {fields.map((name: string) => {
                const attrs = ATTRS_BY_PROPERTY_NAME[name];
                return (
                    <CommonProperty
                        key={name}
                        name={name}
                        obj={currentListing}
                        onChange={handleChange}
                        {...attrs}
                        className={styles.field}
                    />
                );
            })}
            <YMaps query={{ load: "package.full" }}>
                <Map
                    state={{
                        center,
                        zoom,
                        controls: ["zoomControl", "rulerControl", "trafficControl", "typeSelector", "geolocationControl"]
                    }}
                    onClick={(e: any) => {
                        setCenter(undefined);
                        const [latitude, longitude] = e.get("coords");
                        setCurrentListing({
                            ...currentListing,
                            latitude,
                            longitude
                        });
                    }}
                    width="50%"
                    height="400px"
                >
                    {coords.length > 0 && <Placemark geometry={coords} />}
                </Map>
            </YMaps>
            {error !== "" && (
                <div className={styles.error}>
                    {error}
                </div>
            )}
            <div className={styles.controls}>
                <Button variant="contained" onClick={handleSave} color="success" sx={{width: "156px"}} >
                    {t("save")}
                </Button>
                <Button variant="text" onClick={onCancel} sx={{width: "156px"}} >
                    {t("cancel")}
                </Button>
            </div>
        </div>
    );
};
