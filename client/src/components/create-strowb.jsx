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

    const previewStrowb = (values, event) => {

        event.preventDefault();

        const strowbData = {
            delay: values.delay,
            frame1: values['image1'],
            frame2: values['image2']
        }

        setStrowbData(strowbData);
        setStrowbPreviewVisible(true);

    }

    return (
        <div className="create-strowb-form">
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(previewStrowb)}>
                    <FileLoader name="image1" showPreview={true} required={true} />
                    <FileLoader name="image2" showPreview={true} required={true} />
                    <input name="preview" type="submit" value="preview" />
                </form>
            </FormProvider>
            {strowbPreviewVisible && <StrowbPreview closeFunction={() => {setStrowbPreviewVisible(false)}} strowbData={strowbData} />}
        </div>
    );
}

export default CreateStrowb;
