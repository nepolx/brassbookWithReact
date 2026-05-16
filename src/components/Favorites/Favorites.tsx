// pages/Favorites/Favorites.tsx
import { useContext, useEffect, useId, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import Sidebar from "../User/components/sidebar";
import layoutClasses from "../User/styles/layout.module.css";
import styles from "./favorites.module.css";
import { Context } from "../../../Context/context";
import { IRecord } from "../../../models/response/IRecord";
import Dictaphone from "../User/components/dictaphone";
import MusicPlayer from "../User/components/musicPlayer";
import IconSearch from "../../assets/icons/IconSearch";
import IconArrowLeft from "../../assets/icons/IconArrowLeft";
import IconArrow from "../../assets/icons/IconArrow";

type SortOption = "alphabet" | "popularity" | "duration";


function IconHeart() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.59001 1.80835C8.53417 1.80835 7.58917 2.32168 7.00001 3.10918C6.41084 2.32168 5.46584 1.80835 4.41001 1.80835C2.61917 1.80835 1.16667 3.26668 1.16667 5.06918C1.16667 5.76335 1.27751 6.40502 1.47001 7.00002C2.39167 9.91668 5.23251 11.6608 6.63834 12.1392C6.83667 12.2092 7.16334 12.2092 7.36167 12.1392C8.76751 11.6608 11.6083 9.91668 12.53 7.00002C12.7225 6.40502 12.8333 5.76335 12.8333 5.06918C12.8333 3.26668 11.3808 1.80835 9.59001 1.80835Z" fill="#F70A51"/>
    </svg>
  );
}

function IconHeartBig({ filled }: { filled: boolean }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill={filled ? "#F70A51" : "#C3C3D0"} fill-opacity="0.1"/>
      <path d="M25.18 9.6167C23.0683 9.6167 21.1783 10.6434 20 12.2184C18.8217 10.6434 16.9317 9.6167 14.82 9.6167C11.2383 9.6167 8.33333 12.5334 8.33333 16.1384C8.33333 17.5267 8.55499 18.81 8.93999 20C10.7833 25.8334 16.465 29.3217 19.2767 30.2784C19.6733 30.4184 20.3267 30.4184 20.7233 30.2784C23.535 29.3217 29.2167 25.8334 31.06 20C31.445 18.81 31.6667 17.5267 31.6667 16.1384C31.6667 12.5334 28.7617 9.6167 25.18 9.6167Z" fill={filled ? "#F70A51" : "#C3C3D0"}/>
    </svg>
  );
}

function IconNote() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.91 5.75662V6.82912C19.91 7.72745 19.5525 8.49745 18.92 8.94662C18.5258 9.23995 18.04 9.37745 17.5358 9.37745C17.2242 9.37745 16.9125 9.33162 16.5917 9.22162L11.66 7.58078V16.4999C11.66 18.9016 9.7075 20.8541 7.30583 20.8541C4.90417 20.8541 2.95167 18.9016 2.95167 16.4999C2.95167 14.0983 4.90417 12.1458 7.30583 12.1458C8.46083 12.1458 9.50583 12.6041 10.285 13.3374V3.66662C10.285 2.77745 10.6517 2.00745 11.2842 1.54912C11.9167 1.09995 12.76 0.999115 13.6033 1.27412L17.655 2.63078C18.9017 3.04328 19.91 4.44578 19.91 5.75662Z" fill="#C3C3D0"/>
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#F4F4F6"/>
      <rect x="17.9998" y="7" width="4" height="26" rx="2" fill="#C3C3D0"/>
      <rect x="7" y="22" width="4" height="26" rx="2" transform="rotate(-90 7 22)" fill="#C3C3D0"/>
    </svg>
  );
}

// Карточка трека
interface TrackRowProps {
  record: IRecord;
  isSelected: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  onAddToAlbum: () => void;
}

function TrackRow({ record, isSelected, onSelect, onToggleFavorite, onAddToAlbum }: TrackRowProps) {
  // Форматируем duration (секунды → M:SS)
  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <li>
      <article
        className={`${styles.track} ${isSelected ? styles["track--selected"] : ""}`}
        onClick={onSelect}
        style={{ cursor: "pointer" }}
      >
        {/* Левая часть: обложка + название */}
        <div className={styles.track__left}>
          <div className={styles.track__cover}>
            {/* Обложка — пока градиент-заглушка, при наличии fileUrl показывай превью */}
            <div className={styles.track__cover__placeholder} aria-hidden="true" />
            <div className={styles.track__cover__overlay} aria-hidden="true" />
          </div>

          <div className={styles.track__info}>
            {/* Разбиваем title на "Композитор — Название" если через тире */}
            <h3 className={styles.track__composer}>{record.title}</h3>
          </div>

          <time className={styles.track__duration}>
            {record.duration ? formatDuration(record.duration) : "—"}
          </time>
        </div>

        {/* Правая часть: кнопки */}
        <div className={styles.track__actions} onClick={e => e.stopPropagation()}>
          {/* Ноты — пока заглушка кнопка */}
          <button
            type="button"
            className={styles.track__btn__notes}
            aria-label="Открыть ноты"
          >
            <IconNote />
            Ноты
          </button>

          {/* Убрать из избранного */}
          <button
            type="button"
            className={styles.track__btn__heart}
            aria-label="Убрать из избранного"
            onClick={onToggleFavorite}
          >
            <IconHeartBig filled={record.isFavorite} />
          </button>

          {/* Добавить в альбом */}
          <button
            type="button"
            className={styles.track__btn__add}
            aria-label="Добавить в альбом"
            onClick={onAddToAlbum}
          >
            <IconPlus />
          </button>
        </div>
      </article>
    </li>
  );
}

// Основной компонент
const Favorites = observer(function Favorites() {
  const navigate  = useNavigate();
  const searchId  = useId();
  const { albumStore } = useContext(Context);

  const [search,      setSearch]      = useState("");
  const [sortBy,      setSortBy]      = useState<SortOption>("alphabet");
  const [selectedId,  setSelectedId]  = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Загружаем избранное при монтировании
  useEffect(() => {
    albumStore.loadFavorites(0, "createdAt");
  }, [albumStore]);

  // Фильтрация и сортировка на фронте
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = [...albumStore.favorites];

    if (q) {
      result = result.filter(r => r.title.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case "alphabet":
        result.sort((a, b) => a.title.localeCompare(b.title, "ru"));
        break;
      case "duration":
        result.sort((a, b) => (a.duration ?? 0) - (b.duration ?? 0));
        break;
      case "popularity":
        result.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
        break;
    }

    return result;
  }, [albumStore.favorites, search, sortBy]);

  // Пагинация на фронте (20 за страницу)
  const PAGE_SIZE = 20;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const handleToggleFavorite = async (record: IRecord) => {
    try {
      await albumStore.toggleFavorite(record);
    } catch {
      // ошибка в store
    }
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(0);
    // Если нужна серверная сортировка — раскомментируй:
    // albumStore.loadFavorites(0, sort === "alphabet" ? "name" : "createdAt");
  };

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: "alphabet",   label: "по алфавиту" },
    { id: "popularity", label: "по популярности" },
    { id: "duration",   label: "по длительности" },
  ];

  const count = albumStore.favorites.length;

  return (
    <>
      <Sidebar />
      <div className={layoutClasses.wrapper}>
        <div className={layoutClasses.main__area}>
          <div className={layoutClasses.left__column}>

            {/* ── Шапка ── */}
            <header className={styles.header}>
              <div className={styles.header__left}>
                <div className={styles.header__top}>
                  <h1 className={styles.header__title}>Избранное</h1>
                  <p className={styles.header__count}>
                    {count === 0
                      ? "Нет композиций"
                      : `${count} ${pluralComposition(count)}`}
                  </p>
                  <div className={styles.header__hint}>
                    <span className={styles.header__hint__text}>
                      Композиции, отмеченные тобою
                    </span>
                    <span className={styles.header__heart__icon} aria-hidden="true">
                      <IconHeart/>
                    </span>
                    <span className={styles.header__hint__text}>
                      , находятся здесь.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.header__back}
                  onClick={() => navigate("/user")}
                >
                  <IconArrowLeft />
                  Вернуться в Личный кабинет
                </button>
              </div>
              <img 
                src="/src/assets/img/likeImg.png" 
                alt=""
                style={{
                  width: "100%",
                  maxWidth: 200,
                  height: 160,
                  objectFit: "cover",
                  margin: "-16px 0",
                }} 
                aria-hidden="true"
              />
            </header>

            {/* ── Поиск ── */}
            <div className={styles.search__bar} role="search">
              <IconSearch />
              <input
                id={searchId}
                type="search"
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(0); }}
                placeholder="Найти композицию"
                className={styles.search__input}
              />
            </div>

            {/* ── Фильтры ── */}
            <div
              className={styles.filter__bar}
              role="tablist"
              aria-label="Сортировка"
            >
              {sortOptions.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={sortBy === opt.id}
                  onClick={() => handleSortChange(opt.id)}
                  className={
                    styles.filter__btn +
                    (sortBy === opt.id ? " " + styles["filter__btn--active"] : "")
                  }
                >
                  {opt.id === "alphabet" && (
                    <span style={{ fontWeight: 800, fontSize: 11 }}>АЯ</span>
                  )}
                  {opt.label}
                </button>
              ))}
            </div>

            {/* ── Состояние загрузки / ошибки ── */}
            {albumStore.isLoading && (
              <p style={{ color: "var(--font-color-muted)", fontSize: 14, padding: "8px 0" }}>
                Загрузка...
              </p>
            )}

            {/* ── Пустое состояние ── */}
            {!albumStore.isLoading && filtered.length === 0 && (
              <div className={styles.empty}>
                <p className={styles.empty__title}>
                  {search ? "Ничего не найдено" : "Здесь пока пусто"}
                </p>
                <p className={styles.empty__text}>
                  {search
                    ? "Попробуй другой запрос"
                    : "Отмечай треки сердечком — они появятся здесь"}
                </p>
              </div>
            )}

            {/* ── Список треков ── */}
            {paginated.length > 0 && (
              <ul className={styles.track__list} aria-label="Список избранных треков">
                {paginated.map(record => (
                  <TrackRow
                    key={record.id}
                    record={record}
                    isSelected={selectedId === record.id}
                    onSelect={() => setSelectedId(prev => prev === record.id ? null : record.id)}
                    onToggleFavorite={() => handleToggleFavorite(record)}
                    onAddToAlbum={() => {
                      // TODO: открыть модалку выбора альбома
                      console.log("Добавить в альбом:", record.id);
                    }}
                  />
                ))}
              </ul>
            )}

            {/* ── Пагинация ── */}
            {totalPages > 1 && (
              <nav className={styles.pagination} aria-label="Страницы">
                <button
                  type="button"
                  className={styles.pagination__btn}
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 0}
                  aria-label="Предыдущая страница"
                >
                  <IconArrowLeft />
                </button>
                <div className={styles.pagination__pages}>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-current={currentPage === i ? "page" : undefined}
                      className={
                        styles.pagination__page +
                        (currentPage === i ? " " + styles["pagination__page--active"] : "")
                      }
                      onClick={() => setCurrentPage(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.pagination__btn}
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage >= totalPages - 1}
                  aria-label="Следующая страница"
                >
                  <IconArrow />
                </button>
              </nav>
            )}

          </div>

          <div className={layoutClasses.right__column}>
            <Dictaphone />
            <MusicPlayer />
          </div>
        </div>

        <footer className={layoutClasses.footer}>
          <span className={layoutClasses.footer__logo}>BrassBook</span>
          <span className={layoutClasses.footer__copy}>
            ©2019-2024, Brassbook. Все права защищены
          </span>
        </footer>
      </div>
    </>
  );
});

// Склонение слова "композиция"
function pluralComposition(n: number): string {
  const mod10  = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "композиция";
  if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return "композиции";
  return "композиций";
}

export default Favorites;