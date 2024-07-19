import React, { useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import AppContent from "../../Layouts/layout/AppContent";
import Overview from "../../Components/Dashboard/Overview";
import Orders from "../../Components/Dashboard/Orders";

const Dashboard = ({ customer, orders, devices, orders_count_wdate }) => {
    const { auth } = usePage().props;

    useEffect(() => {
        if (auth.user) {
            window.history.pushState(
                null,
                document.title,
                window.location.href
            );

            window.addEventListener("popstate", (event) => {
                window.history.pushState(
                    null,
                    document.title,
                    window.location.href
                );
            });
        }
    }, [auth.user]);

    return (
        <>
            <Head title="Dashboard" />
            <AppContent>
                <Overview
                    customer={customer}
                    orders={orders}
                    devices={devices}
                />
            </AppContent>
        </>
    );
};

export default Dashboard;
