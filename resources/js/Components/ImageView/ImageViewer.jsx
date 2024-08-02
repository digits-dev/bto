import React from 'react'

const ImageViewer = ({show, onClose, selectedImage}) => {

    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop z-[120] overflow-auto select-none" onClick={onClose}>
            <div>
                <img src={`/images/uploaded-images/${selectedImage}`}  className='h-96' />
            </div>
        </div>
    )
}

export default ImageViewer