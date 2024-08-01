import React from 'react'

const ImageView = ({path, imageTitle}) => {
  return (
    <>
        {path && 
            <div>
                <p className='font-nunito-sans font-bold text-red-400 mb-1 '>{imageTitle}</p>
                <label
                htmlFor="input-file"
                className="relative w-full"
                >
                    <div
                        id="image-view"
                        className="flex flex-col justify-center items-center w-full h-[250px] rounded-2xl border-2 border-gray-400 bg-blue-50 text-center overflow-hidden"
                    >
                        <a
                            href={`/images/uploaded-images/${path}`}
                            target="_blank"
                        >
                            <img
                                className='w-64 h-52'
                                src={`/images/uploaded-images/${path}`}
                                alt="Uploaded File"
                            />
                        </a>
                    </div>
                </label>
            </div>
           
        }
        
    </>
  )
}

export default ImageView