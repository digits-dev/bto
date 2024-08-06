import { Head, Link, useForm } from '@inertiajs/react'
import React, { useContext, useEffect, useState } from 'react'
import ContentPanel from '../../Components/Table/ContentPanel'
import InputComponent from '../../Components/Forms/Input'
import moment from 'moment'
import { NavbarContext } from "../../Context/NavbarContext";
import ImageView from '../../Components/ImageView/ImageView'
import ImageViewer from '../../Components/ImageView/ImageViewer'
import TableButton from '../../Components/Table/Buttons/TableButton'

const ForClaimStore = ({order_list, status, store_name, my_privilege_id}) => {
  const { setTitle } = useContext(NavbarContext);
  useEffect(() => {
      setTimeout(() => {
          setTitle("BTO Edit Quotation Form");
      }, 5);
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);
  const [handleImageView, setHandleImageView] = useState(false);
  const [clickedImage, setClickedImage] = useState('');

  const handleCloseImageView = () => {
      setHandleImageView(!handleImageView);
  };

  const handleImageClick = () => {

      setHandleImageView(!handleImageView);
  };

 

const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
        setSelectedImage(URL.createObjectURL(event.target.files[0]));
        setData("final_uploaded_file", event.target.files[0]);
    }
};

  const { data, setData, post, processing, errors, reset } = useForm({
    receipt_2: "",
    order_list_id: order_list.id,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
        title: `<p class="font-nunito-sans">Are you sure that you want to  <span style="color: #10B981
        };" >CLOSE</span> this?</p>`,

        showCancelButton: true,
        confirmButtonText: "Confirm",
        confirmButtonColor: "#201E43",
        cancelButtonColor: "#134B70",
        icon: "question",
        iconColor: "#134B70",
        reverseButtons: true,
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                
            } catch (error) {
                console.log(error);
            }
        }
    });
};


  return (
    <>
      <ContentPanel>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-col lg:flex-row gap-4">
          <div className="lg:w-[50%] lg:flex gap-3">
            <div className="flex flex-col flex-1 gap-y-3">
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="status"
                    value={status}
                />
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="reference_number"
                    value={order_list.reference_number}
                />
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="customer_name"
                    value={order_list.customer_name}
                />
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="order_qty"
                    value={order_list.order_qty}
                />
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="store_name"
                    value={store_name}
                />
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="phone_number"
                    value={order_list.phone_number}
                />
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="item_description"
                    value={order_list.item_description}
                />
                {order_list.digits_item_description && 
                  <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="digits_item_description"
                    value={order_list.digits_item_description}
                  />
                }
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="uom"
                    displayName="UOM"
                    value={order_list.uom}
                />
            </div>
            <div className="flex flex-col flex-1 gap-y-3">
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="brand"
                    value={order_list.brand}
                />
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="part_number"
                    value={order_list.part_number}
                />
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="cash_price"
                    value={order_list.cash_price}
                />
                {order_list.digits_code && 
                  <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="digits_code"
                    value={order_list.digits_code}
                  />
                }
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="estimated_srp"
                    value={order_list.estimated_srp}
                />
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="final_srp"
                    value={order_list.final_srp}
                />
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="po_number"
                    displayName="PO Number"
                    value={order_list.po_number}
                />
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="dr_number"
                    displayName="DR Number"
                    value={order_list.dr_number}
                />
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="order_date"
                    value={order_list.order_date}
                />
            </div>
          </div>
          <div className="sm:w-full lg:w-[50%] my-2 mx-auto flex flex-col gap-5">
            <div className='md:flex-row flex flex-col gap-3 justify-evenly'>
              <ImageView imageTitle="Original Image" path={order_list.original_uploaded_file} handleImageClick={()=>{handleImageClick(); setClickedImage(order_list.original_uploaded_file)}}/>
              <ImageView imageTitle="Final Image" path={order_list.final_uploaded_file} handleImageClick={()=>{handleImageClick(); setClickedImage(order_list.final_uploaded_file)}}/>
            </div>
            <div className='md:flex-row flex flex-col gap-3 justify-evenly'>
              <ImageView imageTitle="Reciept 1" path={order_list.original_uploaded_file} handleImageClick={()=>{handleImageClick(); setClickedImage(order_list.original_uploaded_file)}}/>
              <div>
                  <p className="font-nunito-sans font-bold text-red-400 mb-1 ">
                      Upload Receipt
                  </p>
                  <label
                      htmlFor="input-file"
                      className="relative w-full"
                  >
                      <input
                          required
                          id="input-file"
                          name="image"
                          type="file"
                          accept="image/*"
                          className="z-0 absolute w-full h-full opacity-0 cursor-pointer"
                          onChange={handleImageChange}
                      />
                      <div
                          id="image-view"
                          className="flex flex-col justify-center items-center w-64 h-[250px] rounded-2xl border-2 border-dashed border-gray-400 p-7 cursor-pointer bg-[#f5fbff] text-center"
                      >
                          {selectedImage ? (
                              <img
                                  className="w-56"
                                  id="image"
                                  src={selectedImage}
                                  alt="Selected"
                              />
                          ) : (
                              <>
                                  <img
                                      className="w-32"
                                      id="image"
                                      src="/images/others/upload.png"
                                      alt="Upload"
                                  />
                                  <p className="text-sm font-nunito-sans font-black text-upload-text-color">
                                      Upload Image
                                  </p>
                                  <p className="text-[12px] text-slate-500">
                                      File Supported: JPEG,
                                      PNG
                                  </p>
                              </>
                          )}
                      </div>
                      {errors.final_uploaded_file && (
                          <span className="text-red-500">
                              {errors.final_uploaded_file}
                          </span>
                      )}
                  </label>
              </div>
            </div>
            
          </div>
        </div>
        <div>

        <Link
            className={`bg-secondary text-white overflow-hidden rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2 hover:opacity-80 mr-2`}
            href="/bto_order_list"
        >
            Back
        </Link>
        <TableButton
            extendClass="mt-4"
            type="submit"
        >
            Close
        </TableButton>
        </div>

      </form>
      </ContentPanel>
      <ImageViewer
            show={handleImageView}
            onClose={handleCloseImageView}
            selectedImage={clickedImage}
      />
    </>
  )
}

export default ForClaimStore