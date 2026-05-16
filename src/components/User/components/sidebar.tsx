// components/Sidebar/Sidebar.tsx
import { NavLink } from "react-router-dom";
import layoutClasses from "../styles/layout.module.css";
import sidebarClasses from "../styles/sidebar.module.css";
import Logo from "../../../assets/icons/Logo";
import IconProfile from "../../../assets/icons/IconProfile";
import IconTracks from "../../../assets/icons/IconTracks";
import IconLibrary from "../../../assets/icons/IconLibrary";
import IconPublications from "../../../assets/icons/IconPublications";
import IconExit from "../../../assets/icons/IconExit";
import IconArrow from "../../../assets/icons/IconArrow";
import IconHeart from "../../../assets/icons/IconHeart";

function Sidebar() {
  return (
    <div className={layoutClasses.div__menu}>
      <div className={layoutClasses.menu__inner}>

        <div className={sidebarClasses.nav__block}>
          <Logo />

          <div className={sidebarClasses.nav__section}>
            <p className={sidebarClasses.section__label}>МЕНЮ</p>
            <ul className={sidebarClasses.ul__menu1}>
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  isActive ? sidebarClasses.activeLink : undefined
                }
              >
                <IconProfile /> Личный кабинет
              </NavLink>
              <a href=""><IconTracks /> Произведения</a>
              <a href=""><IconLibrary /> Библиотека</a>
              <NavLink
                to="/publications"
                className={({ isActive }) =>
                  isActive ? sidebarClasses.activeLink : undefined
                }
              >
                <IconPublications /> Публикации
              </NavLink>
            </ul>
          </div>

          <div className={sidebarClasses.nav__section}>
            <p className={sidebarClasses.section__label}>МОИ АЛЬБОМЫ</p>
            <ul className={sidebarClasses.ul__menu2}>
              <NavLink
                to="/user/favorites"
                className={({ isActive }) =>
                  isActive ? sidebarClasses.activeLink : undefined
                }
              >
                <IconHeart /> Избранное
              </NavLink>
              <a href="">Мои записи</a>
              <a href="">Название</a>
              <a href="">Короткое название</a>
              <a href="">Длинное название</a>
            </ul>
            <button className={sidebarClasses.button__all}>
              Посмотреть все <IconArrow />
            </button>
          </div>
        </div>

        <NavLink to="/signin" className={sidebarClasses.a__exit}>
          <IconExit /> Выход
        </NavLink>

      </div>
    </div>
  );
}

export default Sidebar;