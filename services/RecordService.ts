// services/RecordService.ts

import { AxiosResponse } from "axios";
import $api from "../http";
import { IRecord } from "../models/response/IRecord";
import { IPage } from "../models/response/IPage";

export type RecordSortBy = "createdAt" | "name";

export default class RecordService {

    // GET /api/v1/records/my?page=0&sortBy=createdAt
    static getMyRecords(
        page = 0,
        sortBy: RecordSortBy = "createdAt"
    ): Promise<AxiosResponse<IPage<IRecord>>> {
        return $api.get<IPage<IRecord>>("/records/my", { params: { page, sortBy } });
    }

    // GET /api/v1/records/favorites?page=0&sortBy=createdAt
    static getFavorites(
        page = 0,
        sortBy: RecordSortBy = "createdAt"
    ): Promise<AxiosResponse<IPage<IRecord>>> {
        return $api.get<IPage<IRecord>>("/records/favorites", { params: { page, sortBy } });
    }

    // POST /api/v1/records/{recordId}/favorite
    static addToFavorites(recordId: number): Promise<AxiosResponse<void>> {
        return $api.post<void>(`/records/${recordId}/favorite`);
    }

    // DELETE /api/v1/records/{recordId}/favorite
    static removeFromFavorites(recordId: number): Promise<AxiosResponse<void>> {
        return $api.delete<void>(`/records/${recordId}/favorite`);
    }

    // PUT /api/v1/records/{recordId}/rating   { rating: 1-5 }
    static rateRecord(recordId: number, rating: number): Promise<AxiosResponse<IRecord>> {
        return $api.put<IRecord>(`/records/${recordId}/rating`, { rating });
    }

    // GET /api/v1/records/search?query=...&page=0&sortBy=createdAt
    static searchRecords(
        query: string,
        page = 0,
        sortBy: RecordSortBy = "createdAt"
    ): Promise<AxiosResponse<IPage<IRecord>>> {
        return $api.get<IPage<IRecord>>("/records/search", { params: { query, page, sortBy } });
    }

    // DELETE /api/v1/records/{recordId}
    static deleteRecord(recordId: number): Promise<AxiosResponse<void>> {
        return $api.delete<void>(`/records/${recordId}`);
    }

    // GET /api/v1/records/{recordId}/download  → редирект на fileUrl
    static getDownloadUrl(recordId: number): Promise<AxiosResponse<void>> {
        return $api.get<void>(`/records/${recordId}/download`, {
            maxRedirects: 0,
            validateStatus: (s) => s === 302 || s === 200,
        });
    }
}
