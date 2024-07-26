import { Head, router } from "@inertiajs/react";
import React, { useContext, useEffect, useState } from "react";
import ContentPanel from "../../Components/Table/ContentPanel";
import TopPanel from "../../Components/Table/TopPanel";
import BulkActions from "../../Components/Table/Buttons/BulkActions";
import TableSearch from "../../Components/Table/TableSearch";
import { useToast } from "../../Context/ToastContext";
import { NavbarContext } from "../../Context/NavbarContext";
import PerPage from "../../Components/Table/PerPage";
import TableButton from "../../Components/Table/Buttons/TableButton";
import Import from "../../Components/Table/Buttons/Import";
import Export from "../../Components/Table/Buttons/Export";
import TableContainer from "../../Components/Table/TableContainer";
import Pagination from "../../Components/Table/Pagination";
import Thead from "../../Components/Table/Thead";
import Tbody from "../../Components/Table/Tbody";
import TableHeader from "../../Components/Table/TableHeader";
import RowData from "../../Components/Table/RowData";
import RowStatus from "../../Components/Table/RowStatus";
import RowAction from "../../Components/Table/RowAction";
import Modal from "../../Components/Modal/Modal";
import Row from "../../Components/Table/Row";
import Checkbox from "../../Components/Checkbox/Checkbox";
import axios from "axios";
import StoreLocationForm from "./StoreLocationForm";

const StoreLocation = ({storeLocation,queryParams}) => {
  const { setTitle } = useContext(NavbarContext);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [updateFormValues, setUpdateFormValues] = useState({location_name: '', currentId:'', status: Boolean,});
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { handleToast } = useToast();
  const [loading, setLoading] = useState(false);

  router.on("start", () => setLoading(true));
  router.on("finish", () => setLoading(false));

  useEffect(() => {
    setTimeout(() => {
        setTitle("Submaster - BTO Store Location");
    }, 5);
  }, []);

    
  const handleShowCreate = () => {
    setShowCreate(!showCreate);
  }

  const handleShowEdit = () => {
      setShowEdit(!showEdit);
  }

  const handleCheckboxChange = (itemId) => {
      if (selectedItems.includes(itemId)) {
        setSelectedItems(selectedItems.filter(id => id !== itemId));
      } else {
        setSelectedItems([...selectedItems, itemId]);
      }
  };

  const handleSelectAll = () => {
      if (selectAll) {
        setSelectedItems([]);
      } else {
        const allItemIds = storeLocation?.data.map(item => item.id);
        setSelectedItems(allItemIds);
      }
      setSelectAll(!selectAll);
  };

  const resetCheckbox = () => {
      setSelectedItems([]);
      setSelectAll(false);
  }

  const handleActionSelected = (action) => {
    const actionType = action;
    if(selectedItems?.length === 0){
            handleToast("Nothing selected!", "Error");
    } else{
      Swal.fire({
                title: `<p class="font-nunito-sans" >Set to ${
                    actionType ? "Active" : "Inactive"
                }?</p>`,
                showCancelButton: true,
                confirmButtonText: "Confirm",
                confirmButtonColor: "#201E43",
                cancelButtonColor: "#134B70",
                iconColor: "#134B70",
                iconColor: "#000000",
                reverseButtons: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {

                        const response = await axios.put(
                            "/store_location/bulkupdate",
                            {
                                ids: selectedItems,
                                status: actionType
                            }
                        );

                        if (response.data.status == "success") {
                            handleToast(response.data.message, response.data.status);

                            router.reload({ only: ["storeLocation"] });

                            resetCheckbox();
                        }
                    } catch (error) {}
                }
            });
    }
  };

  const bulkActions = [
    { label: <span><i className="fa fa-check-circle mr-2 text-green-600"></i> Set Active</span>, value: 1 },
    { label: <span><i className="fa fa-times-circle mr-2 text-red-600"></i> Set Inactive</span>, value: 0 },
  ];

  return(
    <>
    <Head title="BTO Store Location"/>
    <ContentPanel>
      <TopPanel>
      <BulkActions actions={bulkActions} onActionSelected={handleActionSelected}></BulkActions>
        <TableSearch queryParams={queryParams} placeholder="Search Store Location"/>
        <PerPage queryParams={queryParams} />
        <TableButton onClick={handleShowCreate}>
            Add Location
        </TableButton>
        <Import importPath="/store_location_import" templatePath="/store_location_template" handleToast={()=>handleToast('Import Success', 'success')}/>
        <Export  path="/store_location_export"/>
      </TopPanel>
      <TableContainer>
        <Thead>
          <Row>
            <TableHeader
              width="sm"
              sortable={false}
              justify="center"
            >
              <Checkbox
                  type="checkbox"
                  name="selectAll"
                  id="selectAll"
                  handleClick={handleSelectAll}
                  isChecked={selectAll}
              />
            </TableHeader>
            <TableHeader name="id" queryParams={queryParams}>
                    Store ID
            </TableHeader>
            <TableHeader name="id" queryParams={queryParams}>
                    Store Location
            </TableHeader>
            <TableHeader name="id" queryParams={queryParams}>
                    Status
            </TableHeader>
            <TableHeader
              sortable={false}
              width="auto"
              justify="center"
            >
                Action
            </TableHeader>
          </Row>
        </Thead>
        <Tbody data={storeLocation.data}>
          {storeLocation && storeLocation.data.map((item) => (
            <Row key={item.id}>
              <RowData center>
                <Checkbox
                    type="checkbox"
                    id={item.id}
                    handleClick={()=>handleCheckboxChange(item.id)}
                    isChecked={selectedItems.includes(item.id)}
                />
              </RowData>
              <RowData isLoading={loading} >
                  {item.id}
              </RowData>
              <RowData isLoading={loading} color={item.color} >
                  {item.location_name}
              </RowData>
              <RowStatus
                  isLoading={loading}
                  systemStatus={item.status ? "active" : "inactive"}
              >
                  {item.status ? "Active" : "Inactive"}
              </RowStatus>
              <RowData isLoading={loading} center>
                  <RowAction
                      type="button"
                      onClick={()=>{
                          handleShowEdit(); 
                          setUpdateFormValues({
                              currentId: item.id,
                              location_name: item.location_name, 
                              status: item.status, 
                          });}}
                      action="edit"
                      size="md"
                  />
              </RowData>
            </Row>
          ))}
        </Tbody>

      </TableContainer>
      <Pagination paginate={storeLocation} onClick={resetCheckbox} />
    </ContentPanel>
    <Modal
        show={showCreate}
        onClose={handleShowCreate}
        title="Add Location"
    >
      <StoreLocationForm
        action="create"
        handleShow={()=>{
          handleShowCreate(); 
            handleToast("Created Store", "success");
        }}   
      />
    </Modal>
    <Modal
        show={showEdit}
        onClose={handleShowEdit}
        title="Edit Store Location"
    >
      <StoreLocationForm
        action="edit" 
        handleShow={()=>{
            handleShowEdit(); 
            handleToast("Updated Store", "success");
        }} 
        updateFormValues={updateFormValues}
      />
    
    </Modal>
    </>
    );
};


export default StoreLocation;