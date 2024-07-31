import React from "react";
import ContentPanel from "../Table/ContentPanel";
import { Link } from "@inertiajs/react";

const DashboardOverviewCard = ({ title, data, src, url }) => {
    return (
        <Link
            href={url}
            className="flex p-5 w-full max-w-[170px] md:max-w-xs border rounded-lg border-gray-400 shadow-custom font-nunito-sans flex-wrap-reverse gap-y-1 justify-center"
        >
            <div className="flex flex-col justify-center flex-1 gap-y-2">
                <p className="text-sm font-bold text-gray-600">{title}</p>
                <p className="font-extrabold text-sm md:text-[30px] ">{data}</p>
            </div>
            <div className="flex bg-overview-gradient p-3 md:p-5 rounded-lg items-center ">
                <img src={src} className="h-4 w-4 md:w-6 md:h-6" />
            </div>
        </Link>
    );
};

const Overview = ({ total_orders, part_input, costing, srp, closed}) => {
    return (
        <>
            <ContentPanel marginBottom={2}>
                <p className="font-extrabold font-nunito-sans mb-3">Overview</p>
                <div className="flex flex-row gap-2 flex-wrap justify-center md:justify-start">
                    <DashboardOverviewCard
                        title="Total Orders"
                        data={total_orders}
                        src={"images/navigation/order-icon.png"}
                        url="/bto_order_list"
                    />
                    <DashboardOverviewCard
                        title="For Part # Input"
                        data={part_input}
                        src={"images/others/hash-icon.png"}
                        url="/bto_order_list"
                    />
                    <DashboardOverviewCard
                        title="For Costing"
                        data={costing}
                        src={"images/others/money-icon.png"}
                        url="/bto_order_list"
                    />
                    <DashboardOverviewCard
                        title="For SRP"
                        data={srp}
                        src={"images/others/tag-icon.png"}
                        url="/bto_order_list"
                    />
                    <DashboardOverviewCard
                        title="Closed"
                        data={closed}
                        src={"images/others/closed-icon.png"}
                        url="/bto_order_list"
                    />
                </div>
            </ContentPanel>
        </>
    );
};

export default Overview;
