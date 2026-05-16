// components/Tracks/Tracks.tsx
import { useContext, useEffect, useId, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import tracksClasses from "../styles/tracks.module.css";
import { useNavigate } from "react-router-dom"; // ← добавлен импорт
import CreateAlbumModal from "../../UserModals/CreateAlbumModal";
import EditAlbumModal from "../../UserModals/EditAlbumModal";
import { Context } from "../../../../Context/context";
import { IAlbum } from "../../../../models/response/IAlbum";
import IconArrow from "../../../assets/icons/IconArrow";
import SearchIcon from "../../../assets/icons/IconSearch";

type SortOption = "alphabet" | "date";

function EditIcon() {
  return (
    <svg className={tracksClasses.album__edit__icon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.333 13.333 2 14l.667-3.333L11.333 2Z"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const Tracks = observer(function Tracks() {
  const searchId = useId();
  const { albumStore } = useContext(Context);
  const navigate = useNavigate();

  const [searchValue, setSearchValue]     = useState("");
  const [sortBy, setSortBy]               = useState<SortOption>("date");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlbum, setEditingAlbum]   = useState<IAlbum | null>(null);

  useEffect(() => {
    albumStore.loadAlbums(0, "createdAt");
    albumStore.loadFavorites(0);
    albumStore.loadMyRecords(0);
  }, [albumStore]);

  const filteredAlbums = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    let result = [...albumStore.albums];
    if (q) {
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        String(a.recordCount).includes(q)
      );
    }
    if (sortBy === "alphabet") {
      result.sort((a, b) => a.name.localeCompare(b.name, "ru"));
    }
    // "date" — порядок с бэка уже по createdAt DESC
    return result;
  }, [albumStore.albums, searchValue, sortBy]);

  // Обработчики модалок
  const handleCreated = async (name: string) => {
    try {
      await albumStore.createAlbum(name);
    } catch {
      // ошибка в сторе
    }
  };

  const handleSaved = async (name: string) => {
    if (!editingAlbum) return;
    try {
      await albumStore.renameAlbum(editingAlbum.id, name);
    } catch {
      // ошибка уже в сторе
    }
  };

  const handleDeleted = async () => {
    if (!editingAlbum) return;
    try {
      await albumStore.deleteAlbum(editingAlbum.id);
    } catch {
      // ошибка уже в сторе
    }
  };

  // Статистика коллекций
  const favoritesCount  = albumStore.favorites.length;
  const myRecordsCount  = albumStore.myRecords.length;

  return (
    <>
    <div className={tracksClasses.tracks}>

      {/* ── Быстрые коллекции ── */}
      <div className={tracksClasses.collections}>
        {/* Избранное */}
        <article
          className={tracksClasses.collection__card}
          aria-label={`Избранное, ${favoritesCount} записей`}
        >
          <div className={tracksClasses.collection__info}>
            <button
              className={tracksClasses.collection__button}
              onClick={() => navigate("/user/favorites")}
            >
              <span className={tracksClasses.collection__title}>Избранное</span>
              <IconArrow />
            </button>
            <p className={tracksClasses.collection__count}>
              {favoritesCount === 0 ? "Нет записей" : `${favoritesCount} ${pluralRecord(favoritesCount)}`}
            </p>
          </div>
          <img 
            src='src/assets/img/likeImg.png' 
            alt=""
            style={{
              width: "100%",
              maxWidth: 174,
              height: "auto",
              objectFit: "cover",
              borderRadius: "0 20px 20px 0",
          }} aria-hidden="true"
          />
        </article>

        {/* Мои записи */}
        <article className={tracksClasses.collection__card} aria-label={`Мои записи, ${myRecordsCount} записей`}>
          <div className={tracksClasses.collection__info}>
            <h2 className={tracksClasses.collection__title}>Мои записи</h2>
            <p className={tracksClasses.collection__count}>
              {myRecordsCount === 0 ? "Нет записей" : `${myRecordsCount} ${pluralRecord(myRecordsCount)}`}
            </p>
          </div>
          <img 
            src='src/assets/img/recordImg.png' 
            alt=""
            style={{
              width: "100%",
              maxWidth: 174,
              height: "auto",
              objectFit: "cover",
              borderRadius: "0 20px 20px 0",
          }} aria-hidden="true"
          />
        </article>
      </div>

      {/* ── Секция альбомов ── */}
      <section className={tracksClasses.albums__section} aria-labelledby="albums-heading">
        <h2 id="albums-heading" className={tracksClasses.albums__title}>Альбомы</h2>

        <div className={tracksClasses.albums__description}>
          <p>Создавай альбомы по тематикам и сохраняй в них свою любимые композиции!</p>
          <p>Чтобы добавить композицию в альбом, нажми на <strong>+</strong>, а затем выбери нужный альбом из списка.</p>
        </div>

        {/* Поиск */}
        <div className={tracksClasses.search__bar}>
          <SearchIcon />
          <input
            id={searchId}
            type="search"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Найти альбом"
            className={tracksClasses.search__input}
          />
        </div>

        {/* Сортировка */}
        <div className={tracksClasses.sort__bar} role="tablist" aria-label="Сортировка альбомов">
          <button
            type="button" role="tab"
            aria-selected={sortBy === "alphabet"}
            onClick={() => { setSortBy("alphabet"); albumStore.loadAlbums(0, "name"); }}
            className={tracksClasses.sort__btn + (sortBy === "alphabet" ? " " + tracksClasses["sort__btn--active"] : "")}
          >
            <span className={tracksClasses.sort__btn__icon}>АЯ</span> по алфавиту
          </button>
          <button
            type="button" role="tab"
            aria-selected={sortBy === "date"}
            onClick={() => { setSortBy("date"); albumStore.loadAlbums(0, "createdAt"); }}
            className={tracksClasses.sort__btn + (sortBy === "date" ? " " + tracksClasses["sort__btn--active"] : "")}
          >
            📅 по дате добавления
          </button>
        </div>

        {/* Состояние загрузки / ошибки */}
        {albumStore.isLoading && (
          <p style={{ color: "var(--font-color-muted)", fontSize: 14, padding: "8px 0" }}>
            Загрузка...
          </p>
        )}
        {albumStore.error && (
          <p style={{ color: "#db422b", fontSize: 14, padding: "8px 0" }}>
            {albumStore.error}
          </p>
        )}

        {/* Сетка альбомов */}
        <div className={tracksClasses.albums__grid}>
          {filteredAlbums.map(album => (
            <article key={album.id} className={tracksClasses.album__card}>
              <div
                className={tracksClasses.album__cover}
                style={{ background: album.avatarUrl ? `url(${album.avatarUrl}) center/cover` : "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" }}
              >
                <button
                  type="button"
                  className={tracksClasses.album__edit__btn}
                  aria-label={`Редактировать альбом ${album.name}`}
                  onClick={() => setEditingAlbum(album)}
                >
                  <EditIcon /> Редактировать
                </button>
              </div>
              <div>
                <p className={tracksClasses.album__name}>{album.name}</p>
                <p className={tracksClasses.album__count}>
                  {album.recordCount} {pluralRecord(album.recordCount)}
                </p>
              </div>
            </article>
          ))}

          {/* Создать альбом */}
          <div>
            <button
              type="button"
              className={tracksClasses.album__create}
              aria-label="Создать альбом"
              onClick={() => setShowCreateModal(true)}
            >
              <span className={tracksClasses.album__create__plus} aria-hidden="true" />
              Создать альбом
            </button>
          </div>
        </div>

        {/* Подгрузить ещё */}
        {albumStore.albumsPage < albumStore.albumsTotalPages - 1 && (
          <button
            type="button"
            onClick={() => albumStore.loadAlbums(albumStore.albumsPage + 1)}
            style={{ marginTop: 12, color: "var(--color-accent)", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}
          >
            Загрузить ещё
          </button>
        )}
      </section>
    </div>

    {/* ── Модальные окна ── */}
    {showCreateModal && (
      <CreateAlbumModal
        onClose={() => setShowCreateModal(false)}
        onCreated={(name) => handleCreated(name)}
      />
    )}
    {editingAlbum && (
      <EditAlbumModal
        albumTitle={editingAlbum.name}
        albumCover={editingAlbum.avatarUrl}
        onClose={() => setEditingAlbum(null)}
        onSaved={(name) => handleSaved(name)}
        onDeleted={handleDeleted}
      />
    )}
    </>
  );
});

// Склонение слова
function pluralRecord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "запись";
  if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return "записи";
  return "записей";
}

export default Tracks;