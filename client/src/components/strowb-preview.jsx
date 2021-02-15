import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";

import {accountService, strowbService} from '@/_services';

const StrowbPreview = ({closeFunction, strowbData}) => {

    const [showFrame1, setShowFrame1] = useState(true);
    const [delay, setDelay] = useState(strowbData.delay || 450) || [0,()=>{}];

    const user = accountService.userValue;

    let interval = null;

    const runInterval = () => {
        interval = setInterval(() => {
            showFrame1 ? setShowFrame1(false) : setShowFrame1(true);
        }, delay);
    }

    const electricsGo = () => {
        const obj = {
            frame1: {
                delay: `${delay}`,
                image: strowbData.frame1
            },
            frame2: {
                delay: `${delay}`,
                image: strowbData.frame2
            },
            userId: user.id
        };
        strowbService.createStrowb(obj)
            .then((response) => {
                console.log(response);
            })
            .catch(() => {})
    }

    const onDelayChange = (event) => {
        setDelay(Number(event.currentTarget.value));
    }

    useEffect(() => {
        runInterval();
        console.log(delay);
        return () => {
            clearInterval(interval);
        }
    }, [showFrame1]);

    return (
        <div className='strowb-preview'>
            <button onClick={closeFunction}>close</button>
            <p>{strowbData.title}</p>
            {showFrame1 && <img src={strowbData.frame1}/>}
            {!showFrame1 && <img src={strowbData.frame2}/>}
            <input name="delay" type="range" min="0" max="3000" value={delay} onChange={onDelayChange} />
            <button onClick={electricsGo}>It's Showtime!</button>
        </div>
    );
}

StrowbPreview.propTypes = {
    strowbData: PropTypes.object.isRequired,
    closeFunction: PropTypes.func.isRequired
}

export default StrowbPreview;
