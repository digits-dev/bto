import React, { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../Context/NavbarContext";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";
import Modal from "../../Components/Modal/Modal";
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
            setTitle("Create BTO Quotation Form");
        }, 5);
    }, []);

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(URL.createObjectURL(event.target.files[0]));
            setData("original_uploaded_file", event.target.files[0]);
        }
    };

    const handleChange = (e) => {
        const name = e.name ? e.name : e.target.name;
        const value = e.value ? e.value : e.target.value;
        setData(name, value);
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: "",
        phone_number: "",
        original_uploaded_file: "",
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

    return (
        <>
            <Head title="Add Form" />
            <form onSubmit={handleSubmit}>
                <ContentPanel>
                    <div className="flex flex-col sm:flex-col lg:flex-row gap-4">
                        <div className="lg:w-[60%] lg:flex gap-3">
                            <div className="flex flex-col flex-1 gap-y-3">
                                <InputComponent
                                    extendClass="w-full "
                                    name="customer_name"
                                    placeholder="Customer Name"
                                    onChange={handleChange}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    displayName={"Order Quantity"}
                                    is_disabled={true}
                                    value={1}
                                />
                                <InputComponent
                                    extendClass="w-full text-red-500"
                                    name="store_name"
                                    placeholder="Store Name"
                                    is_disabled={true}
                                    value={store_name}
                                />
                            </div>
                            <div className="flex flex-col flex-1 gap-y-3">
                                <InputComponent
                                    extendClass="w-full"
                                    placeholder={"Phone Number"}
                                    extendClass1={`${
                                        errors.phone_number
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                    name="phone_number"
                                    onChange={handleChange}
                                />
                                {errors.phone_number && (
                                    <span className="text-red-500 text-sm">
                                        {errors.phone_number}
                                    </span>
                                )}
                                <InputComponent
                                    extendClass="w-full"
                                    placeholder={"Item Description"}
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
                                                className="w-48"
                                                id="image"
                                                src="/images/others/upload.png"
                                                alt="Upload"
                                            />
                                            <p className="text-md font-nunito-sans font-black text-upload-text-color">
                                                Upload Image
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                File Supported: JPEG, PNG
                                            </p>
                                        </>
                                    )}
                                </div>
                                {errors.original_uploaded_file && (
                                    <span className="text-red-500">
                                        {errors.original_uploaded_file}
                                    </span>
                                )}
                            </label>
                            <span
                                className="
                            text-red-500 font-nunito-sans text-sm text-center"
                            >
                                Note: Please upload a screenshot of BTO build
                                with <strong>Peso Amount</strong> price from{" "}
                                <strong>Apple Website</strong>.
                            </span>
                        </div>
                    </div>
                    <div>
                        <Link
                            className={`bg-secondary text-white overflow-hidden  rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2 hover:opacity-80 mr-2`}
                            href="/bto_order_list"
                        >
                            Back
                        </Link>
                        <TableButton type="submit" disabled={processing}>
                            Create
                        </TableButton>
                    </div>
                </ContentPanel>
                <Modal modalLoading show={processing} />
            </form>
        </>
    );
};

export default AddForm;
