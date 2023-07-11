// Тип пользователя
interface User {
    id: number;
    phone: string;
    role: string;
    full_name: string;
    email: string;
}

// Тип объекта недвижимости
interface Listing {
    id: number;
    description: string | null;
    price: number;
    address: string;
    latitude: number | null;
    longitude: number | null;
    status: string;
    date_added: string;
    property_type: string;
    rooms: number | null;
    area: number | null;
    floor: number | null;
    total_floors: number | null;
    user: User;
    agent: User | null;
    images: ObjectImage[];
    category: string;
}

// Тип изображения объекта
interface ObjectImage {
    id?: number | string;
    object_id?: number;
    image_url: string;
    file?: any;
}

// Тип особенности объекта
interface Feature {
    id: number;
    name: string;
    value: string;
}

// Тип значения особенности объекта
interface ObjectFeature {
    object_id: number;
    feature_id: number;
    value: string;
}

// Тип избранного
interface Favorite {
    id: number;
    user_id: number;
    object_id: number;
    date_added: string;
}

// Тип сообщения
interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    object_id: number;
    content: string;
    date_sent: string;
    is_read: boolean;
}

// Тип встречи
interface Appointment {
    id: number;
    user_id: number;
    agent_id: number;
    object_id: number;
    date_time: string;
    status: string;
}

// Фильтры

interface ListingsFilter {
    query?: string;

    price_from?: number;
    price_to?: number;

    rooms_from?: number;
    rooms_to?: number;

    area_from?: number;
    area_to?: number;

    floor_from?: number;
    floor_to?: number;

    total_floors_from?: number;
    total_floors_to?: number;

    created_by_me?: Boolean;
    categories?: string[];
}

interface UsersFilter {
    query?: string;
}

interface FilterDialogProps {
    filter: any;
    onAccept: (filter: any) => void;
    onClose: () => void;
}

// Платеж
interface Payment {
    id: number;
    sum: number;
    pending: Boolean;
    date_time: Date;
}

// Покупка
interface Purchase {
    id: number;
    sum: number;
    date_time: Date;
    object_id: number;
}

// Локация
interface Location {
    name: string;
    coords: number[];
}

export type {
    User,
    Listing,
    ObjectImage,
    Feature,
    ObjectFeature,
    Favorite,
    Message,
    Appointment,
    ListingsFilter,
    UsersFilter,
    FilterDialogProps,
    Payment,
    Purchase,
    Location,
};