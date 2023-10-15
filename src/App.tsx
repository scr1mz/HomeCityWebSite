import React, {useState, useEffect} from 'react';
import { Routes, Route, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ListingsPage } from "./pages/ListingsPage";
import { ListingEditorPage } from "./pages/ListingEditorPage";
import type { ListingEditorPageProps } from "./pages/ListingEditorPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ListingDetailPage } from "./pages/ListingDetailPage";
import { UsersPage } from "./pages/UsersPage";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { refreshToken } from "./services/api/listingApi";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import useLocalStorageState from "use-local-storage-state";

const AllListingsPage = () => <ListingsPage variant="allListings" />;
const MyListingsPage = () => <ListingsPage variant="myListings" />;
const ModerationPage = () => <ListingsPage variant="moderation" />;
const CreateListingPage = () => {
    const { propertyType } = useParams();
    const navigate = useNavigate();
    const navigateToMyListings = () => navigate("/myListings");
    return (
        <ListingEditorPage
            listing={{
                status: "for_sale",
                property_type: propertyType!,
                images: []
            }}
            onSave={navigateToMyListings}
            onCancel={navigateToMyListings}
        />
    );
};
const EditListingPage = () => {
    const props = useOutletContext<ListingEditorPageProps>();
    return <ListingEditorPage {...props} />;
};

export const App = () => {
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [, setCookie, removeCookie] = useCookies(["id", "token"]);
    const [info, setInfo] = useLocalStorageState<any>("info", {defaultValue: {}});
    useEffect(() => {
        const fetch = async () => {
            const res = await refreshToken();
            if (res === null) {
                setError(true);
            } else if (!res.success) {
                removeCookie("id", {path: "/"});
                removeCookie("token", {path: "/"});
                setInfo({});
            } else {
                setCookie("token", res.token, {path: "/", maxAge: 1e12})
                setInfo(res.info);
            }
            setLoading(false);
        };
        fetch();
    }, [setCookie, removeCookie, setInfo]);
    return loading ? <>{t("loading")}</> : error ? <>{t("something_went_wrong")}</> : (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/createListing/:propertyType" element={<CreateListingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/allListings" element={<AllListingsPage />}>
                    <Route path=":id" element={<ListingDetailPage />} />
                </Route>
                {info && info.role === "admin" && <Route path="/users" element={<UsersPage />} />}
                <Route path="/myListings" element={<MyListingsPage />}>
                    <Route path=":id/edit" element={<EditListingPage />} />
                    <Route path=":id" element={<ListingDetailPage />} />
                </Route>
                {info && (info.role === "admin" || info.role === "moderator") && (
                    <Route path="/moderation" element={<ModerationPage />}>
                        <Route path=":id" element={<ListingDetailPage />} />
                    </Route>
                )}
            </Routes>
            <Footer />
        </div>
    );
};
