// stores/AlbumStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import AlbumService, { AlbumSortBy } from "../services/AlbumService";
import RecordService, { RecordSortBy } from "../services/RecordService";
import { IAlbum } from "../models/response/IAlbum";
import { IRecord } from "../models/response/IRecord";
import { getErrorMessage } from "../utils/errorUtils";

export default class AlbumStore {
    //Альбомы
    albums: IAlbum[] = [];
    albumsPage = 0;
    albumsTotalPages = 0;
    albumsSortBy: AlbumSortBy = "createdAt";

    //Записи в альбоме
    currentAlbumId: number | null = null;
    records: IRecord[] = [];
    recordsPage = 0;
    recordsTotalPages = 0;
    recordsSortBy: RecordSortBy = "createdAt";

    //Мои записи
    myRecords: IRecord[] = [];
    myRecordsPage = 0;
    myRecordsTotalPages = 0;

    //Избранное
    favorites: IRecord[] = [];
    favoritesPage = 0;
    favoritesTotalPages = 0;

    //Состояние
    isLoading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    // АЛЬБОМЫ

    async loadAlbums(page = 0, sortBy: AlbumSortBy = this.albumsSortBy) {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await AlbumService.getAlbums(page, sortBy);
            runInAction(() => {
                this.albums = page === 0
                    ? response.data.content
                    : [...this.albums, ...response.data.content];
                this.albumsPage = response.data.number;
                this.albumsTotalPages = response.data.totalPages;
                this.albumsSortBy = sortBy;
            });
        } catch (e) {
            runInAction(() => { this.error = getErrorMessage(e); });
            throw e;
        } finally {
            runInAction(() => { this.isLoading = false; });
        }
    }

    async createAlbum(name: string): Promise<IAlbum> {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await AlbumService.createAlbum(name);
            runInAction(() => {
                // Добавляем новый альбом в начало списка
                this.albums = [response.data, ...this.albums];
            });
            return response.data;
        } catch (e) {
            runInAction(() => { this.error = getErrorMessage(e); });
            throw e;
        } finally {
            runInAction(() => { this.isLoading = false; });
        }
    }

    async renameAlbum(id: number, name: string): Promise<void> {
        this.error = null;
        try {
            const response = await AlbumService.renameAlbum(id, name);
            runInAction(() => {
                const idx = this.albums.findIndex(a => a.id === id);
                if (idx !== -1) this.albums[idx] = response.data;
            });
        } catch (e) {
            runInAction(() => { this.error = getErrorMessage(e); });
            throw e;
        }
    }

    async deleteAlbum(id: number): Promise<void> {
        this.error = null;
        try {
            await AlbumService.deleteAlbum(id);
            runInAction(() => {
                this.albums = this.albums.filter(a => a.id !== id);
                if (this.currentAlbumId === id) {
                    this.currentAlbumId = null;
                    this.records = [];
                }
            });
        } catch (e) {
            runInAction(() => { this.error = getErrorMessage(e); });
            throw e;
        }
    }

    // ЗАПИСИ В АЛЬБОМЕ
    async loadRecordsInAlbum(
        albumId: number,
        page = 0,
        sortBy: RecordSortBy = this.recordsSortBy
    ) {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await AlbumService.getRecordsInAlbum(albumId, page, sortBy);
            runInAction(() => {
                this.currentAlbumId = albumId;
                this.records = page === 0
                    ? response.data.content
                    : [...this.records, ...response.data.content];
                this.recordsPage = response.data.number;
                this.recordsTotalPages = response.data.totalPages;
                this.recordsSortBy = sortBy;
            });
        } catch (e) {
            runInAction(() => { this.error = getErrorMessage(e); });
            throw e;
        } finally {
            runInAction(() => { this.isLoading = false; });
        }
    }

    async addRecordToAlbum(albumId: number, recordId: number): Promise<void> {
        this.error = null;
        try {
            await AlbumService.addRecordToAlbum(albumId, recordId);
            runInAction(() => {
                const album = this.albums.find(a => a.id === albumId);
                if (album) album.recordCount += 1;
            });
        } catch (e) {
            runInAction(() => { this.error = getErrorMessage(e); });
            throw e;
        }
    }

    async moveRecord(recordId: number, fromAlbumId: number, toAlbumId: number): Promise<void> {
        this.error = null;
        try {
            await AlbumService.moveRecord(recordId, fromAlbumId, toAlbumId);
            runInAction(() => {
                if (this.currentAlbumId === fromAlbumId) {
                    this.records = this.records.filter(r => r.id !== recordId);
                }
                const from = this.albums.find(a => a.id === fromAlbumId);
                const to   = this.albums.find(a => a.id === toAlbumId);
                if (from) from.recordCount = Math.max(0, from.recordCount - 1);
                if (to)   to.recordCount += 1;
            });
        } catch (e) {
            runInAction(() => { this.error = getErrorMessage(e); });
            throw e;
        }
    }

    // МОИ ЗАПИСИ
    async loadMyRecords(page = 0, sortBy: RecordSortBy = "createdAt") {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await RecordService.getMyRecords(page, sortBy);
            runInAction(() => {
                this.myRecords = page === 0
                    ? response.data.content
                    : [...this.myRecords, ...response.data.content];
                this.myRecordsPage = response.data.number;
                this.myRecordsTotalPages = response.data.totalPages;
            });
        } catch (e) {
            runInAction(() => { this.error = getErrorMessage(e); });
            throw e;
        } finally {
            runInAction(() => { this.isLoading = false; });
        }
    }

    async deleteRecord(recordId: number): Promise<void> {
        this.error = null;
        try {
            await RecordService.deleteRecord(recordId);
            runInAction(() => {
                this.myRecords = this.myRecords.filter(r => r.id !== recordId);
                this.records    = this.records.filter(r => r.id !== recordId);
            });
        } catch (e) {
            runInAction(() => { this.error = getErrorMessage(e); });
            throw e;
        }
    }

    // ИЗБРАННОЕ

    async loadFavorites(page = 0, sortBy: RecordSortBy = "createdAt") {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await RecordService.getFavorites(page, sortBy);
            runInAction(() => {
                this.favorites = page === 0
                    ? response.data.content
                    : [...this.favorites, ...response.data.content];
                this.favoritesPage = response.data.number;
                this.favoritesTotalPages = response.data.totalPages;
            });
        } catch (e) {
            runInAction(() => { this.error = getErrorMessage(e); });
            throw e;
        } finally {
            runInAction(() => { this.isLoading = false; });
        }
    }

    async toggleFavorite(record: IRecord): Promise<void> {
        this.error = null;
        try {
            if (record.isFavorite) {
                await RecordService.removeFromFavorites(record.id);
            } else {
                await RecordService.addToFavorites(record.id);
            }
            runInAction(() => {
                const toggle = (list: IRecord[]) => {
                    const r = list.find(r => r.id === record.id);
                    if (r) r.isFavorite = !r.isFavorite;
                };
                toggle(this.records);
                toggle(this.myRecords);
                toggle(this.favorites);
                if (record.isFavorite) {
                    this.favorites = this.favorites.filter(r => r.id !== record.id);
                }
            });
        } catch (e) {
            runInAction(() => { this.error = getErrorMessage(e); });
            throw e;
        }
    }

    // ОЦЕНКА

    async rateRecord(recordId: number, rating: number): Promise<void> {
        this.error = null;
        try {
            const response = await RecordService.rateRecord(recordId, rating);
            runInAction(() => {
                const update = (list: IRecord[]) => {
                    const r = list.find(r => r.id === recordId);
                    if (r) r.averageRating = response.data.averageRating;
                };
                update(this.records);
                update(this.myRecords);
                update(this.favorites);
            });
        } catch (e) {
            runInAction(() => { this.error = getErrorMessage(e); });
            throw e;
        }
    }
}
