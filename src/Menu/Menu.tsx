import React from 'react';
import styles from './Menu.module.scss';


function Menu(props) {
    let addRandomMarker = () => {
        props.onAddRandomMarker();
    };
    let calculateRoute = () => {
        props.onCalculateRoute();
    };
    return (
        <div>
            <ul className={styles.inlineList}>
                <li onClick={addRandomMarker}>Add random marker</li>
                <li onClick={calculateRoute}>Calculate route</li>
            </ul>
        </div>
    )
}

export default Menu;
