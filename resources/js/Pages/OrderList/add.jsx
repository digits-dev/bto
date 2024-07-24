import React, { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../Context/NavbarContext";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";

import { Head, useForm, Link } from "@inertiajs/react";
import InputComponent from "../../Components/Forms/Input";
import DropdownSelect from "../../Components/Dropdown/Dropdown";
import { useToast } from "../../Context/ToastContext";
import TableButton from "../../Components/Table/Buttons/TableButton";

const AddForm = ({ store_name }) => {
    const { setTitle } = useContext(NavbarContext);
    const { handleToast } = useToast();

    useEffect(() => {
        setTimeout(() => {
            setTitle("BTO Create Order Form");
        }, 5);
    }, []);

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(URL.createObjectURL(event.target.files[0]));
            setData("uploaded_file", event.target.files[0]);
        }
    };

    const handleChange = (e) => {
        const name = e.name ? e.name : e.target.name;
        const value = e.value ? e.value : e.target.value;
        setData(name, value);
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: "",
        order_qty: "",
        phone_number: "",
        stores_id: "",
        uploaded_file: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `<p class="font-nunito-sans" >Are you sure that you want to create this?</p>`,
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
                    post("/bto_order_list/add_save", {
                        onSuccess: (response) => {
                            console.log(response);
                            handleToast("Order added successfully", "success");
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

    const storeOptions = store_name.map((store) => ({
        id: store.id,
        label: store.location_name,
        name: store.location_name,
    }));

    return (
        <>
            <AppContent>
                <Head title="Add Form" />
                <ContentPanel>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col sm:flex-col lg:flex-row gap-4">
                            <div className="lg:w-[60%] lg:flex gap-3">
                                <div className="flex flex-col flex-1 gap-y-3">
                                    <InputComponent
                                        extendClass="w-full "
                                        name="customer_name"
                                        onChange={handleChange}
                                    />
                                    <InputComponent
                                        extendClass="w-full"
                                        extendClass1={`${
                                            errors.order_qty
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        name="order_qty"
                                        onChange={handleChange}
                                    />
                                    {errors.order_qty && (
                                        <span className="text-red-500">
                                            {errors.order_qty}
                                        </span>
                                    )}
                                    <InputComponent
                                        extendClass="w-full"
                                        extendClass1={`${
                                            errors.phone_number
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        name="phone_number"
                                        onChange={handleChange}
                                    />
                                    {errors.phone_number && (
                                        <span className="text-red-500">
                                            {errors.phone_number}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 gap-y-3">
                                    <DropdownSelect
                                        displayName="Store Name"
                                        name="stores_id"
                                        selectType="react-select"
                                        is_required={true}
                                        onChange={handleChange}
                                        options={storeOptions}
                                    />
                                    <InputComponent
                                        extendClass="w-full"
                                        name="item_description"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="sm:w-full lg:w-[40%] flex flex-col self-center m-4">
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
                                        className="flex flex-col justify-center items-center w-full h-[380px] rounded-2xl border-2 border-dashed border-gray-400 p-7 cursor-pointer bg-[#f5fbff] text-center"
                                    >
                                        {selectedImage ? (
                                            <img
                                                className="w-80"
                                                id="image"
                                                src={selectedImage}
                                                alt="Selected"
                                            />
                                        ) : (
                                            <>
                                                <img
                                                    className="w-75"
                                                    id="image"
                                                    src="/images/others/upload.png"
                                                    alt="Upload"
                                                />
                                                <p className="text-sm font-bold">
                                                    Upload Image
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    File Supported: JPEG, PNG
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>
                        <Link
                            className={`bg-secondary text-white overflow-hidden  rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2 hover:opacity-80 mr-2`}
                            href="/bto_order_list"
                        >
                            Back
                        </Link>
                        <TableButton type="submit">Create</TableButton>
                    </form>
                </ContentPanel>
            </AppContent>
        </>
    );
};

export default AddForm;
