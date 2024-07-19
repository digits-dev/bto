import React, { useContext, useEffect, useRef, useState } from "react";
import AppFooter from "@/Layouts/layout/AppFooter.jsx";
import AppSidebar from "@/Layouts/layout/AppSidebar.jsx";
import AppNavbar from "@/Layouts/layout/AppNavbar.jsx";
import AppContent from "@/Layouts/layout/AppContent.jsx";
import { NavbarProvider } from "../../Context/NavbarContext";

const Layout = ({ children }) => {
    return (
        <NavbarProvider>
            <div className="h-screen bg-app-gradient flex">
                <AppSidebar />
                <div className="bg-red-100 w-full flex flex-col overflow-hidden">
                    <AppNavbar />
                    <div className="bg-white flex-1 w-full flex flex-col overflow-auto ">
                        <div className="flex-1">
                            <AppContent>{children}</AppContent>
                        </div>
                        <AppFooter />
                    </div>
                </div>
            </div>
        </NavbarProvider>
    );
};

export default Layout;
