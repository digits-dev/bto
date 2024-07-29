import React, { useContext, useEffect } from "react";
import ContentPanel from "../../Components/Table/ContentPanel";
import { NavbarContext } from "../../Context/NavbarContext";
import { Head } from "@inertiajs/react";
import InputComponent from "../../Components/Forms/Input";


const ProfilePage = ({ user, store }) => {
    const { setTitle } = useContext(NavbarContext);
   

    useEffect(() => {
        setTimeout(() => {
            setTitle("User Information");
        }, 5);
    }, []);




    return (
        <>
            <Head title="Profile" />
            <ContentPanel>
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
                            <InputComponent name="Location" value={user.user_store?.location_name || 'No Location Set'} is_disabled={true}/>
                           
                        </div>
                    </div>
            </ContentPanel>
        </>
    );
};

export default ProfilePage;
