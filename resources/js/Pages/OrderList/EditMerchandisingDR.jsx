import React, { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../Context/NavbarContext";
import ContentPanel from "../../Components/Table/ContentPanel";
import ImageView from "../../Components/ImageView/ImageView";
import { Head, useForm, Link } from "@inertiajs/react";
import InputComponent from "../../Components/Forms/Input";
import { useToast } from "../../Context/ToastContext";
import TableButton from "../../Components/Table/Buttons/TableButton";
import ImageViewer from "../../Components/ImageView/ImageViewer";
import Modal from "../../Components/Modal/Modal";


const EditFormMerchandisingDR = ({ order_list, status, store_name }) => {
    const { setTitle } = useContext(NavbarContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const { handleToast } = useToast();

    useEffect(() => {
        setTimeout(() => {
            setTitle("BTO Edit Quotation Form");
        }, 5);
    }, []);
    const [handleImageView, setHandleImageView] = useState(false);
    const [clickedImage, setClickedImage] = useState("");
    const [isReceipt, setIsReceipt] = useState(false);

    console.log("isReceipt:", isReceipt);
    const handleCloseImageView = () => {
        setHandleImageView(!handleImageView);
    };

    const handleImageClick = () => {
        setHandleImageView(!handleImageView);
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(URL.createObjectURL(event.target.files[0]));
            setData("uploaded_receipt1", event.target.files[0]);
        }
    };

    const handleChange = (e) => {
        const name = e.name ? e.name : e.target.name;
        const value = e.value ? e.value : e.target.value;
        setData(name, value);
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        dr_number: "",
        order_list_id: order_list.id,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `<p class="font-nunito-sans" >Are you sure that you want to edit this?</p>`,
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
                    post("/bto_order_list/edit_save", {
                        onSuccess: (response) => {
                            console.log(response);
                            handleToast(
                                "Order Updated successfully",
                                "success"
                            );
                        },
                    });
                } catch (error) {
                    {
                        console.log(error);
                    }
                }
            }
        });
    };

    return (
        <>
            <Head title="Edit Form" />
            <form onSubmit={handleSubmit}>
                <ContentPanel>
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
                                    name="phone_number"
                                    value={order_list.phone_number}
                                />
                                <InputComponent
                                    displayName="Store Name"
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="stores_id"
                                    value={store_name}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    displayName="UOM"
                                    value="PCS"
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    displayName="Brand"
                                    value="Apple"
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="item_description"
                                    value={order_list.item_description}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    value={order_list.part_number}
                                    displayName="Part Number"
                                    name="part_number"
                                />
                            </div>
                            <div className="flex flex-col flex-1 gap-y-3">
                                {order_list.digits_code && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        displayName="Digits Code"
                                        value={order_list.digits_code}
                                    />
                                )}
                                {order_list.digits_item_description && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        name="digits_item_description"
                                        value={
                                            order_list.digits_item_description
                                        }
                                    />
                                )}
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    displayName="Supplier Cost"
                                    value={order_list.supplier_cost}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    displayName="Cash Price"
                                    value={order_list.cash_price}
                                    is_disabled={true}
                                />

                                <InputComponent
                                    extendClass="w-full"
                                    displayName={"Estimated Store Cost"}
                                    value={order_list.estimated_store_cost}
                                    is_disabled={true}
                                />

                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    displayName={"Estimated Landed Cost"}
                                    value={order_list.estimated_landed_cost}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    displayName={"Estimated SRP"}
                                    is_disabled={true}
                                    value={order_list.estimated_srp}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    displayName={"Final SRP"}
                                    is_disabled={true}
                                    value={order_list.final_srp}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    displayName={"PO Number"}
                                    value={order_list.po_number}
                                />
                                <InputComponent
                                    isrequired={true}
                                    extendClass="w-full"
                                    displayName={"DR Number"}
                                    name={"dr_number"}
                                    onChange={handleChange}
                                    placeholder="DR Number"
                                />
                            </div>
                        </div>
                        <div className="sm:w-full lg:w-[50%] my-2 mx-auto flex flex-col gap-5">
                            <div className="md:flex-row flex flex-col gap-3 justify-evenly">
                                <ImageView
                                    imageTitle="Original Image"
                                    path={order_list.original_uploaded_file}
                                    handleImageClick={() => {
                                        handleImageClick();
                                        setClickedImage(
                                            order_list.original_uploaded_file
                                        );
                                        setIsReceipt(false);
                                    }}
                                />
                                <ImageView
                                    imageTitle="Final Image"
                                    path={order_list.final_uploaded_file}
                                    handleImageClick={() => {
                                        handleImageClick();
                                        setClickedImage(
                                            order_list.final_uploaded_file
                                        );
                                        setIsReceipt(false);
                                    }}
                                />
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <p className="font-nunito-sans font-bold text-red-400 mb-1 ">
                                    Uploaded Receipt
                                </p>
                                <div className="w-[80%] flex flex-col self-center m-4">
                                    <div
                                        id="image-view"
                                        className="flex flex-col justify-center items-center w-full h-[270px] rounded-2xl border-2 border-gray-400 p-7  bg-white text-center cursor-pointer"
                                        onClick={() => {
                                            handleImageClick();
                                            setClickedImage(
                                                order_list.uploaded_receipt1
                                            );
                                            setIsReceipt(true);
                                        }}
                                    >
                                        <img
                                            className="w-60"
                                            src={`/images/uploaded-receipts/${order_list.uploaded_receipt1}`}
                                            alt="Uploaded File"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Link
                            className={`bg-secondary text-white overflow-hidden  rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2 hover:opacity-80 mr-2`}
                            href="/bto_order_list"
                        >
                            Back
                        </Link>
                        <TableButton
                            extendClass="mt-4"
                            type="submit"
                            disabled={processing}
                        >
                            Update
                        </TableButton>
                    </div>
                </ContentPanel>
                <Modal modalLoading show={processing}/>
            </form>
            <ImageViewer
                show={handleImageView}
                isReceipt={isReceipt}
                onClose={handleCloseImageView}
                selectedImage={clickedImage}
            />
        </>
    );
};

export default EditFormMerchandisingDR;
