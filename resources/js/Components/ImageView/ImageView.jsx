import React from "react";

const ImageView = ({ path, imageTitle, handleImageClick, isReceipt }) => {
    const imageSrc = isReceipt
        ? `/images/uploaded-receipts/${path}`
        : `/images/uploaded-images/${path}`;
    return (
        <>
            {path && (
                <div>
                    <p className="font-nunito-sans font-bold text-red-400 mb-1 ">
                        {imageTitle}
                    </p>
                    <label className="relative w-full">
                        <div
                            onClick={handleImageClick}
                            id="image-view"
                            className="flex flex-col justify-center items-center w-full h-[250px] rounded-2xl border-2 border-gray-400 bg-blue-50 text-center overflow-hidden cursor-pointer"
                        >
                            <img
                                className="w-64 h-52"
                                src={imageSrc}
                                alt="Uploaded File"
                            />
                        </div>
                    </label>
                </div>
            )}
        </>
    );
};

export default ImageView;
