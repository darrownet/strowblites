import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";

import { strowbService } from '@/_services';

const StrowbPreview = ({closeFunction, strowbData}) => {

    const [showFrame1, setShowFrame1] = useState(true);

    let interval = null;

    const runInterval = () => {
        interval = setInterval(() => {
            showFrame1 ? setShowFrame1(false) : setShowFrame1(true);
        }, strowbData.frame1.delay);
    }

    const electricsGo = () => {
        console.log(strowbData);
        strowbService.createStrowb(strowbData)
            .then((response) => {
                console.log(response);
            })
            .catch(() => {})
    }

    useEffect(() => {
        runInterval();
        return () => {
            clearInterval(interval);
        }
    }, [showFrame1]);

    return (
        <div className='strowb-preview'>
            <button onClick={closeFunction}>close</button>
            <p>{strowbData.title}</p>
            {showFrame1 && <img src={strowbData.frame1.image}/>}
            {!showFrame1 && <img src={strowbData.frame2.image}/>}
            <button onClick={electricsGo}>It's Showtime!</button>
        </div>
    );
}

StrowbPreview.propTypes = {
    strowbData: PropTypes.object.isRequired,
    closeFunction: PropTypes.func.isRequired
}

export default StrowbPreview;
