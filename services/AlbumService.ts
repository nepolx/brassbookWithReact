// services/AlbumService.ts
import { AxiosResponse } from "axios";
import $api from "../http";
import { IAlbum } from "../models/response/IAlbum";
import { IRecord } from "../models/response/IRecord";
import { IPage } from "../models/response/IPage";

export type AlbumSortBy = "createdAt" | "name";
export type RecordSortBy = "createdAt" | "name";

export default class AlbumService {

    // GET /api/v1/albums?page=0&sortBy=createdAt
    static getAlbums(
        page = 0,
        sortBy: AlbumSortBy = "createdAt"
    ): Promise<AxiosResponse<IPage<IAlbum>>> {
        return $api.get<IPage<IAlbum>>("/albums", { params: { page, sortBy } });
    }

    // POST /api/v1/albums   { name }
    static createAlbum(name: string): Promise<AxiosResponse<IAlbum>> {
        return $api.post<IAlbum>("/albums", { name });
    }

    // PUT /api/v1/albums/{id}/rename   { name }
    static renameAlbum(id: number, name: string): Promise<AxiosResponse<IAlbum>> {
        return $api.put<IAlbum>(`/albums/${id}/rename`, { name });
    }

    // DELETE /api/v1/albums/{id}
    static deleteAlbum(id: number): Promise<AxiosResponse<void>> {
        return $api.delete<void>(`/albums/${id}`);
    }

    // GET /api/v1/albums/{id}/records?page=0&sortBy=createdAt
    static getRecordsInAlbum(
        albumId: number,
        page = 0,
        sortBy: RecordSortBy = "createdAt"
    ): Promise<AxiosResponse<IPage<IRecord>>> {
        return $api.get<IPage<IRecord>>(`/albums/${albumId}/records`, { params: { page, sortBy } });
    }

    // POST /api/v1/albums/{albumId}/records/{recordId}
    static addRecordToAlbum(albumId: number, recordId: number): Promise<AxiosResponse<void>> {
        return $api.post<void>(`/albums/${albumId}/records/${recordId}`);
    }

    // PUT /api/v1/albums/records/{recordId}/move?from={fromId}&to={toId}
    static moveRecord(
        recordId: number,
        fromAlbumId: number,
        toAlbumId: number
    ): Promise<AxiosResponse<void>> {
        return $api.put<void>(`/albums/records/${recordId}/move`, null, {
            params: { from: fromAlbumId, to: toAlbumId }
        });
    }
}
