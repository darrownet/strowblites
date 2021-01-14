import React, {useCallback, useState} from 'react';
import PropTypes from "prop-types";
import {Controller, useFormContext} from "react-hook-form";
import {useDropzone} from 'react-dropzone';

const FileUploader = ({name, showPreview, required}) => {

    const {setValue} = useFormContext();

    const onDrop = useCallback((acceptedFiles) => {
        setSelectedFile(acceptedFiles[0].name);

        const reader = new FileReader();

        reader.onload = () => {
            setValue(name, reader.result);
        };

        function readAs(file) {
            const typeReadMapping = {
                "application/pdf": function (file) {
                    reader.readAsDataURL(file);
                },
                "text/html": function (file) {
                    reader.readAsText(file, "utf-8")
                },
                "image/png": function (file) {
                    reader.readAsDataURL(file);
                },
                "image/jpeg": function (file) {
                    reader.readAsDataURL(file);
                },
                "image/gif": function (file) {
                    reader.readAsDataURL(file);
                },
                "text/plain": function (file) {
                    reader.readAsBinaryString(file)
                }
            };

            typeReadMapping[file.type] ?
                typeReadMapping[file.type](file) :
                typeReadMapping["text/html"](file);
        }
        readAs(acceptedFiles[0]);

        showPreview && setPreviewImage(URL.createObjectURL(acceptedFiles[0]));
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false})

    const [selectedFile, setSelectedFile] = useState('');
    const [previewImage, setPreviewImage] = useState('');

    return (
        <Controller name={name} defaultValue={name} rules={{required: required}} as={
            <div className="file-uploader" {...getRootProps()}>
                <input name={name} {...getInputProps()} />
                <div className="upload-instructions">
                    {
                        isDragActive ?
                            <p>Drop the file here ...</p> :
                            <p>Drag and drop a file here, or click to select a file.</p>
                    }
                </div>
                {previewImage && (
                    <div className="selected-image"><img src={previewImage}/><span>{selectedFile}</span></div>
                )}
                {!previewImage && (
                    <div className="selected-file-name">{selectedFile}</div>
                )}
            </div>
        }/>
    )
};

FileUploader.propTypes = {
    name: PropTypes.string.isRequired,
    showPreview: PropTypes.bool,
    required: PropTypes.bool
};

FileUploader.defaultProps = {
    showPreview: false,
    required: true
};

export default FileUploader;
