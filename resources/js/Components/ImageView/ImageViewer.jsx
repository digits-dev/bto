import React from "react";

const ImageViewer = ({ show, onClose, selectedImage, isReceipt }) => {
    if (!show) {
        return null;
    }

    const imageSrc = isReceipt
        ? `/images/uploaded-receipts/${selectedImage}`
        : `/images/uploaded-images/${selectedImage}`;

    return (
        <div
            className="modal-backdrop z-[120] overflow-auto select-none"
            onClick={onClose}
        >
            <div>
                <img src={imageSrc} className="h-[700px]" alt="Selected" />
            </div>
        </div>
    );
};

export default ImageViewer;
