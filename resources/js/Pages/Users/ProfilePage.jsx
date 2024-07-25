import React, { useContext, useEffect } from "react";
import ContentPanel from "../../Components/Table/ContentPanel";
import { NavbarContext } from "../../Context/NavbarContext";
import { Head, useForm } from "@inertiajs/react";
import InputComponent from "../../Components/Forms/Input";
import ReactSelect from "../../Components/Forms/ReactSelect";
import TableButton from "../../Components/Table/Buttons/TableButton";
import { useToast } from "../../Context/ToastContext";

const ProfilePage = ({ user, store }) => {
    const { setTitle } = useContext(NavbarContext);
    const { data, setData, processing, reset, put, errors } = useForm({
        selectedLocation: {value: (user.user_store && user.user_store.id), label: (user.user_store && user.user_store.location_name)},
    });

    const { handleToast } = useToast();


    useEffect(() => {
        setTimeout(() => {
            setTitle("User Information");
        }, 5);
    }, []);


    const storeOptions = store.map((store) => ({
        value: store.id,
        label: store.location_name,
    }));

    
    const handleChange = (storeOptions) => {
        setData('selectedLocation', storeOptions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `<p class="font-nunito-sans text-3xl" >Save Changes?</p>`,
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor: "#201E43",
            cancelButtonColor: "#134B70",
            icon: "question",
            iconColor: "#134B70",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                put(`/profile/${user?.id}`, {onSuccess: (data)=>{handleToast(data.props.auth.sessions.message, data.props.auth.sessions.status)}});
            }
        });
    }

    return (
        <>
            <Head title="Profile" />
            <ContentPanel>
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center p-10 font-nunito-sans space-x-20">
                        <div className="w-52 h-52 border-4 border-secondary rounded-full overflow-hidden mb-5">
                            <img
                                src="/images/navigation/user-icon.png"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="w-5/12 space-y-3">
                            <InputComponent name="Name" value={user.name} is_disabled={true}/>
                            <InputComponent name="Email" value={user.email} is_disabled={true}/>
                            <InputComponent name="Privilege" value={user.user_privilege.name} is_disabled={true}/>
                            <ReactSelect
                                name="stores_id"
                                displayName="Location"
                                placeholder="Select Location"
                                options={storeOptions}
                                onChange={handleChange}
                                value={data.selectedLocation.value != null && data.selectedLocation}
                            />
                        </div>
                    </div>
                    <TableButton>
                        {processing ? "Saving..." : "Save"}
                    </TableButton>
                </form>
            </ContentPanel>
        </>
    );
};

export default ProfilePage;
