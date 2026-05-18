import classes from './image.module.css';
import Group1 from './src/assets/img/Group 1.png'

const ImagePipe = () => {
    return (
        <div>
            <img src={Group1} alt="" className={classes.imgback}/>
        </div>
    );
};

export default ImagePipe;