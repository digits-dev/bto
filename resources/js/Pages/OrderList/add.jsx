import React, { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../Context/NavbarContext";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";

import { Head, useForm } from "@inertiajs/react";
import InputComponent from "../../Components/Forms/Input";
import DropdownSelect from "../../Components/Dropdown/Dropdown";

const AddForm = () => {
    const { setTitle } = useContext(NavbarContext);
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
        store_name: "",
        customer_name: "",
        uploaded_file: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e);
        post("/bto_add_Save", {
            onSuccess: () => {},
        });
    };

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
                                    ></InputComponent>
                                    <InputComponent
                                        extendClass="w-full"
                                        name="order_qty"
                                        onChange={handleChange}
                                    ></InputComponent>
                                    <InputComponent
                                        extendClass="w-full"
                                        name="phone_number"
                                        onChange={handleChange}
                                    ></InputComponent>
                                </div>
                                <div className="flex flex-col flex-1 gap-y-3">
                                    <DropdownSelect
                                        displayName="Store Name"
                                        name="store_name"
                                        selectType="react-select"
                                        onChange={handleChange}
                                        options={[
                                            {
                                                id: 1,
                                                label: "Test",
                                                name: "Test",
                                            },
                                            {
                                                id: 2,
                                                label: "Test2",
                                                name: "Test2",
                                            },
                                        ]}
                                    ></DropdownSelect>
                                    <InputComponent
                                        extendClass="w-full"
                                        name="item_description"
                                        onChange={handleChange}
                                    ></InputComponent>
                                </div>
                            </div>
                            <div className="sm:w-full lg:w-[40%] flex flex-col self-center">
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
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                    <div
                                        id="image-view"
                                        className="flex flex-col justify-center items-center w-full h-[380px] rounded-2xl border-2 border-dashed border-gray-400 p-7 cursor-pointer bg-white text-center"
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
                                                    className="w-80"
                                                    id="image"
                                                    src="/images/others/upload.png"
                                                    alt="Upload"
                                                />
                                                <p>Upload File</p>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>
                        <button type="submit">Create</button>
                    </form>
                </ContentPanel>
            </AppContent>
        </>
    );
};

export default AddForm;
