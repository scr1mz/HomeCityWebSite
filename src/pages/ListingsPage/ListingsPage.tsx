import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { ListingCard } from '../../components/ListingCard';
import { SearchBar } from '../../components/SearchBar';
import { ListingsFilterDialog } from '../../components/ListingsFilterDialog';
import type { Listing, ListingsFilter, Location } from '../../utils/types/listingTypes';
import { getListings, API_URL, getListingById } from '../../services/api/listingApi';
import styles from './ListingsPage.module.scss';
import Button from '@mui/material/Button';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import MapIcon from '@mui/icons-material/Map';
import IconButton from '@mui/material/IconButton';
import { YMaps, Map } from '@pbe/react-yandex-maps';
import useLocalStorageState from 'use-local-storage-state';
import Badge from '@mui/material/Badge';
import qs from 'qs';

const LIMIT = 5;

const filterExt = (variant: string): ListingsFilter => (
    variant === "myListings"
        ? {created_by_me: true}
        : variant === "moderation"
            ? {categories: ["checking"]}
            : {}
);

interface ListingsMapProps {
    variant: string;
    zoom: number;
    center: number[];
	filter: ListingsFilter;
    onObjectClick: (id: number) => void;
    onBoundsChange: (zoom: number, center: number[]) => void;
}

const ListingsMap: React.FC<ListingsMapProps> = ({variant, zoom, center, filter, onObjectClick, onBoundsChange}) => {
    const [ymaps, setYmaps] = useState<any>();
    const [map, setMap] = useState<any>();
    const [mgr, setMgr] = useState<any>();

    useEffect(() => {
        if (ymaps && map && !mgr) {
            const loadingObjectManager = new ymaps.LoadingObjectManager(
                "",
                {
                    clusterize: true
                }
            );
            loadingObjectManager.objects.events.add(
                "click",
                (e: any) => onObjectClick(e.get("objectId"))
            );
            map.geoObjects.add(loadingObjectManager);
            setMgr(loadingObjectManager);
        }
    }, [ymaps, map, mgr, onObjectClick]);

    const suffix = qs.stringify({filter: {...filter, ...filterExt(variant)}});
    const urlTemplate = `${API_URL}/objects?bbox=%b` + (suffix.length > 0 ? `&${suffix}` : "");

    useEffect(() => {
        if (ymaps && map && mgr) {
            mgr.setUrlTemplate(urlTemplate);
            mgr.reloadData();
        }
    }, [ymaps, map, mgr, urlTemplate]);

    return (
        <YMaps query={{ load: "package.full" }}>
            <Map
                instanceRef={map => setMap(map)}
                onLoad={ymaps => setYmaps(ymaps)}
                onBoundsChange={(e: any) => onBoundsChange(e.get("newZoom"), e.get("newCenter"))}
                state={{
                    center,
                    zoom,
                    controls: ["zoomControl", "rulerControl", "trafficControl", "typeSelector", "geolocationControl"]
                }}
                width="100%"
                height="400px"
            />
        </YMaps>
    );
};

interface ListingsPageProps {
	variant: string;
}

export const ListingsPage: React.FC<ListingsPageProps> = ({variant}) => {
    const {t} = useTranslation();
    const [cookies] = useCookies(["id", "token"]);
    const [listings, setListings] = useState<Listing[]>([]);
    const [filter, setFilter] = useState<ListingsFilter>({});
    const [listing, setListing] = useState<Listing | undefined>();
    const [pos, setPos] = useState(0);
    const match = useMatch(`/${variant}/:id/*`);
    const navigate = useNavigate();
    const [mapVisible, setMapVisible] = useState(false);
    const [location] = useLocalStorageState<Location>("location");
    const [zoom, setZoom] = useState(9);
    const [center, setCenter] = useState(location!.coords);

    useEffect(() => {
        const fetch = async () => {
            setListings(await getListings(0, LIMIT, {...filter, ...filterExt(variant)}));
        };
        fetch();
    }, [filter, variant, cookies.token]);

    useEffect(() => {
        if (match) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo(0, pos);
        }
    }, [match, pos]);

    const handleMoreClick = async () => {
        const newListings = await getListings(listings.length ? listings[listings.length - 1].id : 0, LIMIT, {...filter, ...filterExt(variant)});
        if (newListings.length > 0) {
            setListings([...listings, ...newListings]);
        }
    };

    const handleFilterAppy = async (filter: ListingsFilter) => {
        setListing(undefined);
        setListings(await getListings(0, LIMIT, {...filter, ...filterExt(variant)}));
        setFilter(filter);
    };

    const onListingChange = (listing: Listing) => {
        setListings(listings.map(item => item.id === listing.id ? listing : item));
    };

    const onListingRemove = (id: number) => {
        setListings(listings.filter(item => item.id !== id));
    };

    const onListingEdit = (listing: Listing) => {
        setPos(window.scrollY);
        setListing(listing);
        navigate(`/${variant}/${listing.id}/edit`);
    };

    const onListingClick = (id: number) => {
        setPos(window.scrollY);
        navigate(`/${variant}/${id}`);
    };

    const onObjectClick = async (id: number) => {
        const listing = await getListingById(id.toString());
        if (listing) {
            setListing(listing);
        } else {
            setListing(undefined);
        }
    };

    const RightControls = () => {
        return (
            <Badge color="primary" variant="dot" invisible={!mapVisible}>
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                        setListing(undefined);
                        setMapVisible(!mapVisible)
                    }}
                    className={styles.mapIcon}
                    disableRipple
                >
                    <MapIcon />
                </IconButton>
            </Badge>
        );
    };

    return match
        ? (
            <Outlet
                context={{
                    listing,
                    onSave: (listing: Listing) => {
                        onListingChange(listing);
                        setListing(undefined);
                        navigate("/myListings");
                    },
                    onCancel: () => {
                        navigate("/myListings");
                    }
                }}
            />
        )
        : (
            <div className={styles.listingsPage}>
                <SearchBar filter={filter} onFilterAppy={handleFilterAppy} FilterDialog={ListingsFilterDialog} RightControls={RightControls} />
                {
                    mapVisible
                        ? (
                            <>
                                <div className={styles.map}>
                                    <ListingsMap
                                        variant={variant}
                                        zoom={zoom}
                                        center={center}
                                        filter={filter}
                                        onObjectClick={onObjectClick}
                                        onBoundsChange={(zoom, center) => {
                                            setZoom(zoom);
                                            setCenter(center);
                                        }}
                                    />
                                </div>
                                {listing !== undefined && (
                                    <div className={styles.listings}>
                                        <ListingCard
                                            key={listing.id}
                                            listing={listing}
                                            variant={variant}
                                            onClick={onListingClick}
                                            onChange={onListingChange}
                                            onRemove={onListingRemove}
                                            onEdit={onListingEdit}
                                        />
                                    </div>
                                )}
                            </>
                        )
                        : (
                            <>
                                <div className={styles.listings}>
                                    {listings.map(
                                        listing => (
                                            <ListingCard
                                                key={listing.id}
                                                listing={listing}
                                                variant={variant}
                                                onClick={onListingClick}
                                                onChange={onListingChange}
                                                onRemove={onListingRemove}
                                                onEdit={onListingEdit}
                                            />
                                        )
                                    )}
                                </div>
                                <div className={styles.loadMoreButton}>
                                    <Button onClick={handleMoreClick} variant="text">
                                        {t("more")}
                                    </Button>
                                </div>
                            </>
                        )
                }
            </div>
        );
};
