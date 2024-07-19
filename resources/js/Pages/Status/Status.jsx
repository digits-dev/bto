import { Head } from '@inertiajs/react'
import React, { useContext, useEffect } from 'react'
import { NavbarContext } from "../../Context/NavbarContext";
import AppContent from '../../Layouts/layout/AppContent'
import ContentPanel from "../../Components/Table/ContentPanel";

const Status = () => {
  const { setTitle } = useContext(NavbarContext);
  useEffect(() => {
    setTimeout(() => {
        setTitle("Status");
    }, 5);
  }, []);

  return (
    <>
      <Head title="Status" />
      <AppContent>
        <ContentPanel>

        </ContentPanel>
      </AppContent>
    </>
  )
}

export default Status