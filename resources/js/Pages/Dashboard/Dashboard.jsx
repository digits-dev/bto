import React, { useContext, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import Overview from "../../Components/Dashboard/Overview";
import { NavbarContext } from "../../Context/NavbarContext";
import Orders from "../../Components/Dashboard/Orders";

const Dashboard = ({ total_orders, part_input, costing, srp, closed, existing, orders_count_wdate }) => {
    const { auth } = usePage().props;
    const { setTitle } = useContext(NavbarContext);

    useEffect(() => {
        setTimeout(() => {
            setTitle("Dashboard");
        }, 5);
    }, []);

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
            <Overview
                total_orders={total_orders}
                part_input={part_input}
                costing={costing}
                srp={srp}
                closed={closed}
                existing={existing}
            />
            <Orders orders_count_wdate={orders_count_wdate} />
        </>
    );
};

export default Dashboard;
