import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getListingById, getUserById, getObjectOwnership } from "../../services/api/listingApi";
import type { Listing, User } from "../../utils/types/listingTypes";
import { TunedCarousel } from "../../components/TunedCarousel/TunedCarousel";
import ListingDetails from "../../components/ListingDetails/ListingDetails";
import ListingActions from "../../components/ListingActions/ListingActions";
import styles from "./ListingDetailPage.module.scss";

export const ListingDetailPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [listing, setListing] = useState<Listing | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [agent, setAgent] = useState<User | null>(null);
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const listingData = await getListingById(id || "");
                console.log("listingData:", listingData);
                setListing(listingData);

                if (listingData) {
                    console.log("listingData.id: ", listingData.id);
                    const ownershipData = await getObjectOwnership(listingData.id);
                    console.log("ownershipData: ", ownershipData);

                    if (ownershipData && ownershipData.user_id) {
                        const userData = await getUserById(ownershipData.user_id.toString());
                        console.log("User data:", userData);
                        setUser(userData);
                        console.log("User state: ", userData);
                    }
                    if (ownershipData && ownershipData.agent_id) {
                        const agentData = await getUserById(ownershipData.agent_id.toString());
                        console.log("Agent data:", agentData);
                        setAgent(agentData);
                        console.log("Agent state: ", agentData);
                    }
                }
            } catch (error) {
                console.error("Error fetching listing data:", error);
            }
        };

        fetchData();
    }, [id]);

    const title = listing ? t(`listing_card.title_${listing.property_type}`, listing) : "";

    return (
        <div className={styles.container}>
            {listing ? (
                <>
                    <div className={styles.containerDetails}>
                        <div className={styles.tunedCarouselContainer}>
                            <TunedCarousel
                                title={title}
                                images={listing.images}
                                imageIndex={imageIndex}
                                setImageIndex={setImageIndex}
                            />
                        </div>
                        <ListingDetails listing={listing} />
                    </div>
                    <div className={styles.containerActions}>
                        <ListingActions listing={listing} user={user} agent={agent} />
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};