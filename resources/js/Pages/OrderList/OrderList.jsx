import React, { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../Context/NavbarContext";
import AppContent from "../../Layouts/layout/AppContent";
import { Head, Link } from "@inertiajs/react";
import ContentPanel from "../../Components/Table/ContentPanel";
import TopPanel from "../../Components/Table/TopPanel";
import TableSearch from "../../Components/Table/TableSearch";
import PerPage from "../../Components/Table/PerPage";
import Export from "../../Components/Table/Buttons/Export";
import TableButton from "../../Components/Table/Buttons/TableButton";
import TableContainer from "../../Components/Table/TableContainer";
import Thead from "../../Components/Table/Thead";
import Row from "../../Components/Table/Row";
import TableHeader from "../../Components/Table/TableHeader";
import Pagination from "../../Components/Table/Pagination";
import Filters from "../../Components/Table/Buttons/Filters";
import Button from "../../Components/Table/Buttons/Button";
import Tbody from "../../Components/Table/Tbody";
import RowData from "../../Components/Table/RowData";
import RowAction from "../../Components/Table/RowAction";
import RowActions from "../../Components/Table/RowActions";
import RowStatus from "../../Components/Table/RowStatus";

const OrderList = ({ orders, my_privilege_id, queryParams }) => {
    const { setTitle } = useContext(NavbarContext);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    useEffect(() => {
        setTimeout(() => {
            setTitle("BTO Order List");
        }, 5);
    }, []);

    const canEdit = (privilegeId, status) => {
        return (
            (privilegeId === 6 && status === 1) ||
            (privilegeId === 7 && status === 4)
        );
    };

    return (
        <>
            <Head title="BTO Order List" />
            <AppContent>
                <ContentPanel>
                    <TopPanel>
                        <TableSearch queryParams={queryParams} />
                        <PerPage queryParams={queryParams} />
                        <Export path="" />
                        <Filters />
                        {[1, 3, 4].includes(my_privilege_id) && (
                            <Button type="btn" href="/bto_order_list/add">
                                Create Order
                            </Button>
                        )}
                    </TopPanel>

                    <TableContainer>
                        <Thead>
                            <Row>
                                {" "}
                                <TableHeader
                                    name="status"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    Status
                                </TableHeader>
                                <TableHeader
                                    name="customer_name"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    Reference #
                                </TableHeader>
                                <TableHeader
                                    name="customer_name"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    Customer Name
                                </TableHeader>
                                <TableHeader
                                    name="order_qty"
                                    queryParams={queryParams}
                                >
                                    Order Qty
                                </TableHeader>
                                <TableHeader
                                    name="store_name"
                                    width="lg"
                                    queryParams={queryParams}
                                >
                                    Store Name
                                </TableHeader>
                                <TableHeader
                                    name="phone_number"
                                    width="lg"
                                    queryParams={queryParams}
                                >
                                    Phone Number
                                </TableHeader>
                                <TableHeader
                                    name="item_description"
                                    width="lg"
                                    queryParams={queryParams}
                                >
                                    Item Description
                                </TableHeader>
                                <TableHeader
                                    name="uom"
                                    queryParams={queryParams}
                                >
                                    UOM
                                </TableHeader>
                                <TableHeader
                                    name="brand"
                                    queryParams={queryParams}
                                >
                                    Brand
                                </TableHeader>
                                <TableHeader
                                    name="part_no"
                                    queryParams={queryParams}
                                >
                                    Part #
                                </TableHeader>
                                <TableHeader
                                    name="store_cost"
                                    queryParams={queryParams}
                                >
                                    Store Cost
                                </TableHeader>
                                <TableHeader
                                    name="srp"
                                    queryParams={queryParams}
                                >
                                    SRP
                                </TableHeader>
                                <TableHeader
                                    name="order_date"
                                    queryParams={queryParams}
                                >
                                    Order Date
                                </TableHeader>
                                <TableHeader
                                    sortable={false}
                                    width="auto"
                                    sticky="right"
                                    justify="center"
                                >
                                    Action
                                </TableHeader>
                            </Row>
                        </Thead>
                        <Tbody data={orders}>
                            {orders &&
                                orders.data.map((item) => (
                                    <Row key={item.id}>
                                        <RowStatus
                                            isLoading={loading}
                                            color={item.bto_status.color}
                                        >
                                            {item.bto_status.status_name}
                                        </RowStatus>
                                        <RowData isLoading={loading}>
                                            {item.reference_number}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.customer_name}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.order_qty}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.store_location.location_name}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.phone_number}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.item_description}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.uom}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.brand}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.part_number}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.store_cost}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.srp}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.order_date}
                                        </RowData>
                                        <RowData
                                            isLoading={loading}
                                            sticky="right"
                                            width="sm"
                                            center
                                        >
                                            <RowActions>
                                                <RowAction
                                                    type="button"
                                                    action="view"
                                                    size="md"
                                                />
                                                {canEdit(
                                                    my_privilege_id,
                                                    item.bto_status.id
                                                ) && (
                                                    <RowAction
                                                        action="edit"
                                                        href={`/bto_order_list/edit/${item.id}`}
                                                        size="md"
                                                    />
                                                )}
                                            </RowActions>
                                        </RowData>
                                    </Row>
                                ))}
                        </Tbody>
                    </TableContainer>
                    <Pagination paginate={orders} />
                </ContentPanel>
            </AppContent>
        </>
    );
};

export default OrderList;
