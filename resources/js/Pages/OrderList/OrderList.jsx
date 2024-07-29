import React, { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../Context/NavbarContext";
import AppContent from "../../Layouts/layout/AppContent";
import { Head, Link, router } from "@inertiajs/react";
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
import moment from "moment";
import ReactSelect from "../../Components/Forms/ReactSelect";
import InputComponent from "../../Components/Forms/Input";

const OrderList = ({ orders, my_privilege_id, queryParams, store , status }) => {
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
            (privilegeId === 7 && status === 2) ||
            (privilegeId === 6 && status === 3)
        );
    };

    const storeOptions = store.map((store) => ({
        value: store.id,
        label: store.location_name,
    }));

    const statusOptions = status.map((status) => ({
        value: status.id,
        label: status.status_name,
    }));

    const [filters, setFilters] = useState({
        status: "",
        reference_number: "",
        customer_name: "",
        stores_id: "",
        phone_number: "",
        item_description: "",
        brand: "",
        part_number: "",
        order_date: "",
    });

    const handleFilter = (e, attrName) => {
        if(attrName) {
            const { value } = e;

            setFilters(filters => ({
                ...filters,
                [attrName]: value,
            }));
          
        }else{
            const { name, value } = e.target;

            setFilters(filters => ({
            ...filters,
            [name]: value,
            }));
       }
    }

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const queryString = new URLSearchParams(filters).toString();
        router.get(`/bto_order_list?${queryString}`);
    };

    return (
        <>
            <Head title="BTO Order List" />
            <ContentPanel>
                <TopPanel>
                    <TableSearch queryParams={queryParams} />
                    <PerPage queryParams={queryParams} />
                    <Filters onSubmit={handleFilterSubmit}>
                        <ReactSelect
                            name="status"
                            placeholder="Select Status"
                            options={statusOptions}
                            value={statusOptions.find(status => status.value === filters.status)} 
                            onChange={(e) => handleFilter(e,'status')}
                        />
                        <InputComponent
                            name="reference_number"
                            value={filters.reference_number}
                            isrequired={false}
                            onChange={handleFilter}
                        />
                        <InputComponent
                            name="customer_name"
                            isrequired={false}
                            value={filters.customer_name}
                            onChange={handleFilter}
                        />
                        <ReactSelect
                            name="stores_id"
                            displayName="Store Name"
                            placeholder="Select Store Name"
                            options={storeOptions}
                            value={storeOptions.find(store => store.value === filters.stores_id)} 
                            onChange={(e) => handleFilter(e,'stores_id')}
                        />
                        <InputComponent
                            name="phone_number"
                            isrequired={false}
                            value={filters.phone_number}
                            onChange={handleFilter}
                        />
                        <InputComponent
                            name="item_description"
                            isrequired={false}
                            value={filters.item_description}
                            onChange={handleFilter}
                        />
                        <InputComponent
                            name="brand"
                            isrequired={false}
                            value={filters.brand}
                            onChange={handleFilter}
                        />
                        <InputComponent
                            name="part_number"
                            displayName="Part #"
                            isrequired={false}
                            value={filters.part_number}
                            onChange={handleFilter}
                        />
                
                        <InputComponent
                            name="order_date"
                            isrequired={false}
                            type="date"
                            value={filters.order_date}
                            onChange={handleFilter}
                        />
                    </Filters>
                    <Export path={`/bto_order_list_export${window.location.search}`} />
                    {[1, 3, 4].includes(my_privilege_id) && (
                        <Button type="btn" href="/bto_order_list/add">
                            Create Order
                        </Button>
                    )}
                </TopPanel>

                <TableContainer>
                    <Thead>
                        <Row>
                            <TableHeader
                                name="status"
                                queryParams={queryParams}
                                width="lg"
                            >
                                Status
                            </TableHeader>
                            <TableHeader
                                name="reference_number"
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
                                name="digits_code"
                                  width="lg"
                                queryParams={queryParams}
                            >
                                Digits Code
                            </TableHeader>
                            <TableHeader name="uom" queryParams={queryParams}>
                                UOM
                            </TableHeader>
                            <TableHeader name="brand" queryParams={queryParams}>
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
                            <TableHeader name="srp" queryParams={queryParams}>
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
                                        {item.store_location?.location_name ||
                                            ""}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.phone_number}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.item_master?.item_description || item.item_description}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.item_master?.digits_code || ""}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.item_master?.uom || ""}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.item_master?.brand || ""}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.item_master?.part_number || item.part_number}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.item_master?.store_cost || ""}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.item_master?.srp || ""}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {moment(item.order_date).format(
                                            "YYYY-MM-DD"
                                        )}
                                    </RowData>
                                    <RowData
                                        isLoading={loading}
                                        sticky="right"
                                        width="sm"
                                        center
                                    >
                                        <RowActions>
                                            <RowAction
                                                action="view"
                                                href={`/bto_order_list/${item.id}`}
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
        </>
    );
};

export default OrderList;
