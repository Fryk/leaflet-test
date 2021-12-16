import React from 'react';
import styles from './LocationList.module.scss';
import { CustomMarker } from '../Model/CustomMarker';

function LocationList(props) {
    const centerMap = (marker: CustomMarker) => {
        props.onCenterMap(marker);
    }

    return (
        <div>
            <ul className={styles.inlineList}>
                {
                    props.markers.map((marker) => (
                        <li key={marker.id}
                            className={marker.visited ? styles.visited : null}
                            onClick={() => centerMap(marker)}>{marker.label}{marker.visited ? ' (visited)' : ''}</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default LocationList;
