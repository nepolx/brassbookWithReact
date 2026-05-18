import Hero from "./homeSections/Hero.tsx";
import Header from "./header/Header.tsx";
import child2 from '../assets/img/child2.png';
import tube from '../assets/img/tube.png';
import notesFromTube from '../assets/img/notesFromTube.png';
import './notes-from-tube.css'
import './tube.css'
import About from "./homeSections/About.tsx";
import Tutor1 from "./homeSections/Tutor1.tsx";
import Tutor2 from "./homeSections/Tutor2.tsx";
import More from "./homeSections/More.tsx";
import {useEffect} from "react";

function Home() {
    useEffect(() => {
        (document.querySelector('.footer') as HTMLElement).style.bottom = -(document.querySelector('.footer') as HTMLElement).getBoundingClientRect().height + 'px';
    }, [])
    return (
        <>
            <Header />
            <main>
                <div className="tube">
                    <img src={tube} alt="труба декоративная" />
                </div>
                <div className="notes-from-tube">
                    <img src={notesFromTube} alt="ноты декоративные" />
                </div>
                <Hero />
                <About isFirst={true}/>
                <About
                    imgSource={child2}
                    textP1={'С помощью наших фонограмм музыканты могут играть в домашних условиях в сопровождении'}
                    text600={'качественного цифрового аккомпанемента.'}
                    textP2={'Использование нашей разработки вовлекает исполнителей в активную форму музицирования, поэтому мы рекомендуем играть дома используя наше сопровождение на протяжении всего времени обучения, но на концертах исполнять произведения под аккомпанемент концертмейстера.'}
                    btn={true}
                    infoOrder={2}
                />
                <Tutor1 />
                <Tutor2 />
                <More />
            </main>
            {/*<Header headerStyle="footer"/>*/}
            <Header headerStyle="footer"/>
        </>
    )
}

export default Home