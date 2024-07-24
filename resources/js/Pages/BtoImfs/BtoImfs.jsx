import React, { useContext, useEffect, useState } from 'react'
import { NavbarContext } from "../../Context/NavbarContext";
import AppContent from '../../Layouts/layout/AppContent';
import { Head } from '@inertiajs/react';
import ContentPanel from "../../Components/Table/ContentPanel";
import TopPanel from '../../Components/Table/TopPanel';
import TableSearch from '../../Components/Table/TableSearch';
import PerPage from '../../Components/Table/PerPage';
import Export from '../../Components/Table/Buttons/Export';
import TableContainer from '../../Components/Table/TableContainer';
import Thead from '../../Components/Table/Thead';
import Row from '../../Components/Table/Row';
import TableHeader from '../../Components/Table/TableHeader';
import Pagination from '../../Components/Table/Pagination';
import Filters from '../../Components/Table/Buttons/Filters';
import Tbody from '../../Components/Table/Tbody';
import RowData from '../../Components/Table/RowData';
import RowAction from '../../Components/Table/RowAction';
import moment from "moment";

const BtoImfs = ({bto_imfs, queryParams}) => {
  const { setTitle } = useContext(NavbarContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
        setTitle("BTO IMFS");
    }, 5);
  }, []);
  
  return (
    <>
      <Head title="BTO IMFS" />
      <ContentPanel>
          <TopPanel>
            <TableSearch queryParams={queryParams} />
            <PerPage queryParams={queryParams} />
            <Export path="" />
            <Filters />
          </TopPanel>
          <TableContainer>
            <Thead>
              <Row>
                <TableHeader
                  name="reference_number"
                  queryParams={queryParams}
                  width='lg'
                >
                  Reference #
                </TableHeader>
                <TableHeader
                  name="customer_name"
                  queryParams={queryParams}
                  width='lg'
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
                  name="stores_id"
                  width='lg'
                  queryParams={queryParams}
                >
                  Store Name
                </TableHeader>
                <TableHeader
                  name="phone_number"
                  width='lg'
                  queryParams={queryParams}
                >
                  Phone Number
                </TableHeader>
                <TableHeader
                  name="item_description"
                  queryParams={queryParams}
                  width='lg'
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
                  name="part_number"
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
            <Tbody data={bto_imfs}>
              {bto_imfs && bto_imfs.data.map((item) => (
                <Row key={item.id}>
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
                    {item.stores_id || ''}
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
                    {moment(item.order_date).format("YYYY-MM-DD")}
                  </RowData>
                  <RowData
                      isLoading={loading}
                      sticky="right"
                      width="sm"
                      center
                  >
                    <RowAction
                        type="button"
                        action="view"
                        size="md"
                    />
                  </RowData>
                </Row>
                
              ))}
            </Tbody>
          </TableContainer>
          <Pagination paginate={bto_imfs} />
      </ContentPanel>
    </>
  )
}

export default BtoImfs