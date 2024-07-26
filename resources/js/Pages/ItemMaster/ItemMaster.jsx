import React, { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../Context/NavbarContext";
import ContentPanel from "../../Components/Table/ContentPanel";
import TopPanel from "../../Components/Table/TopPanel";
import TableSearch from "../../Components/Table/TableSearch";
import PerPage from "../../Components/Table/PerPage";
import TableButton from "../../Components/Table/Buttons/TableButton";
import Import from "../../Components/Table/Buttons/Import";
import Export from "../../Components/Table/Buttons/Export";
import TableContainer from "../../Components/Table/TableContainer";
import Pagination from "../../Components/Table/Pagination";
import Thead from "../../Components/Table/Thead";
import Tbody from "../../Components/Table/Tbody";
import Row from "../../Components/Table/Row";
import TableHeader from "../../Components/Table/TableHeader";
import RowData from "../../Components/Table/RowData";
import { router } from "@inertiajs/react";
import RowAction from "../../Components/Table/RowAction";
// import ItemMasterForm from "./ItemMasterForm";
import Modal from "../../Components/Modal/Modal";
import { useToast } from "../../Context/ToastContext";

const ItemMaster = ({ itemMaster, queryParams }) => {
    const { setTitle } = useContext(NavbarContext);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const { handleToast } = useToast();
    const [updateFormValues, setUpdateFormValues] = useState({
        id: "",
        digits_code: "",
        part_number: "",
        item_description: "",
        srp: "",
        store_cost: "",
    });

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    useEffect(() => {
        setTimeout(() => {
            setTitle("Submaster - Item Master");
        }, 5);
    }, []);

    return (
        <>
            <ContentPanel>
                <TopPanel>
                    <TableSearch queryParams={queryParams} />
                    <PerPage queryParams={queryParams} />
                    <Export />
                </TopPanel>
                <TableContainer>
                    <Thead>
                        <Row>
                            <TableHeader
                                name="digits_code"
                                queryParams={queryParams}
                            >
                                Digits Code
                            </TableHeader>
                            <TableHeader
                                name="part_number"
                                queryParams={queryParams}
                            >
                                Part #
                            </TableHeader>
                            <TableHeader
                                name="item_description"
                                queryParams={queryParams}
                            >
                                Item Description
                            </TableHeader>
                            <TableHeader name="srp" queryParams={queryParams}>
                                SRP
                            </TableHeader>
                            <TableHeader
                                name="store_cost"
                                queryParams={queryParams}
                            >
                                Store Cost
                            </TableHeader>
                        </Row>
                    </Thead>
                    <Tbody data={itemMaster.data}>
                        {itemMaster &&
                            itemMaster.data.map((item) => (
                                <Row key={item.id}>
                                    <RowData isLoading={loading}>
                                        {item.digits_code}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.part_number}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.item_description}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.srp}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.store_cost}
                                    </RowData>
                                </Row>
                            ))}
                    </Tbody>
                </TableContainer>
                <Pagination paginate={itemMaster} />
            </ContentPanel>
        </>
    );
};

export default ItemMaster;
