import React, { useContext, useEffect, useState } from 'react'
import { NavbarContext } from "../../Context/NavbarContext";
import AppContent from '../../Layouts/layout/AppContent';
import { Head } from '@inertiajs/react';
import ContentPanel from "../../Components/Table/ContentPanel";
import TopPanel from '../../Components/Table/TopPanel';
import TableSearch from '../../Components/Table/TableSearch';
import PerPage from '../../Components/Table/PerPage';
import Export from '../../Components/Table/Buttons/Export';
import TableButton from '../../Components/Table/Buttons/TableButton';
import TableContainer from '../../Components/Table/TableContainer';
import Thead from '../../Components/Table/Thead';
import Row from '../../Components/Table/Row';
import TableHeader from '../../Components/Table/TableHeader';
import Pagination from '../../Components/Table/Pagination';
import Filters from '../../Components/Table/Buttons/Filters';
import Tbody from '../../Components/Table/Tbody';
import RowData from '../../Components/Table/RowData';
import RowAction from '../../Components/Table/RowAction';
import RowActions from '../../Components/Table/RowActions';

const BtoImfs = () => {
  const { setTitle } = useContext(NavbarContext);
  useEffect(() => {
    setTimeout(() => {
        setTitle("BTO IMFS");
    }, 5);
  }, []);
  
  return (
    <>
      <Head title="BTO IMFS" />
      <AppContent>
        
      </AppContent>
    </>
  )
}

export default BtoImfs