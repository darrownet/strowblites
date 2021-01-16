import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import { accountService } from '@/_services';
import FileLoader from "./file-uploader";
import StrowbPreview from "./strowb-preview";



const CreateStrowb = () => {

    const methods = useForm();
    const user = accountService.userValue;

    const [strowbPreviewVisible, setStrowbPreviewVisible] = useState(false);
    const [strowbData, setStrowbData] = useState({});

    const createStrowb = (values, event) => {

        event.preventDefault();

        const strowbData = {
            userId: user.id,
            title: values.title,
            style: "",
            frame1: {
                image: values['image1'],
                delay: values.delay,
                caption: values['caption2'],
                style: ""
            },
            frame2: {
                image: values['image2'],
                delay: values.delay,
                caption: values['caption2'],
                style: ""
            }
        }

        setStrowbData(strowbData);
        setStrowbPreviewVisible(true);

    }

    const previewStrowb = () => {
        console.log('preview strowb');
    }

    return (
        <div className="create-strowb-form">
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(createStrowb)}>
                    <h3>create strowb form!</h3>
                    <input type="text" name="title" ref={methods.register} />
                    <hr />
                    <FileLoader name="image1" showPreview={true} required={true} />
                    <input type="text" name="caption1" ref={methods.register} />
                    <hr />
                    <FileLoader name="image2" showPreview={true} required={true} />
                    <input type="text" name="caption2" ref={methods.register} />
                    <hr />
                    <input name="delay" type="range" min="300" max="3000" defaultValue="350" ref={methods.register} />
                    <br />
                    <input name="preview" type="submit" value="preview" />
                </form>
            </FormProvider>
            {strowbPreviewVisible && <StrowbPreview closeFunction={() => {setStrowbPreviewVisible(false)}} strowbData={strowbData} />}
        </div>
    );
}

export default CreateStrowb;
