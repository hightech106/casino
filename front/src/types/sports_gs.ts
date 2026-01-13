export type ISportsListGs = {
    "_id": string;
    "id": string;
    "name": string;
    "url": string;
    "icon": string;
    "color": string;
    "status": boolean;
    "order": number;
    "day": number;
}

export type ISportsLeagueGs = {
    _id: string;
    id: number;
    gid: number;
    name: string;
    sport: string;
    ts: string;
    status: boolean;
    logo: any;
    count: number;
}


export type ISportsMatchGs = {
    "_id": string;
    "id": number;
    "category_id": number;
    "createdAt": string;
    "date": string;
    "events": any;
    "fix_id": string;
    "formatted_date": string;
    "ht": any;
    "home": any;
    "odds": any[];
    "static_id": string;
    "status": string;
    "time": string;
    "timestamp": number;
    "updatedAt": string;
    "venue": string;
    "away": any;
}