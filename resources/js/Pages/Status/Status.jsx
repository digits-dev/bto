import { Head, router } from '@inertiajs/react'
import React, { useContext, useEffect, useState } from 'react'
import { NavbarContext } from "../../Context/NavbarContext";
import AppContent from '../../Layouts/layout/AppContent'
import ContentPanel from "../../Components/Table/ContentPanel";
import TopPanel from "../../Components/Table/TopPanel";
import BulkActions from "../../Components/Table/Buttons/BulkActions";
import { useToast } from "../../Context/ToastContext";
import TableSearch from "../../Components/Table/TableSearch";
import PerPage from "../../Components/Table/PerPage";
import Import from "../../Components/Table/Buttons/Import";
import Export from "../../Components/Table/Buttons/Export";
import TableButton from "../../Components/Table/Buttons/TableButton";
import TableContainer from "../../Components/Table/TableContainer";
import Thead from "../../Components/Table/Thead";
import Checkbox from "../../Components/Checkbox/Checkbox";
import Row from "../../Components/Table/Row";
import Tbody from "../../Components/Table/Tbody";
import TableHeader from "../../Components/Table/TableHeader";
import Pagination from "../../Components/Table/Pagination";
import RowData from "../../Components/Table/RowData";
import RowStatus from "../../Components/Table/RowStatus";
import RowAction from "../../Components/Table/RowAction";
import axios from "axios";
import Modal from "../../Components/Modal/Modal";
import BtoStatusForm from './BtoStatusForm';

const Status = ({btoStatus, queryParams}) => {
  const { setTitle } = useContext(NavbarContext);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [updateFormValues, setUpdateFormValues] = useState({currentValue: '', currentId:'', status: Boolean,  color: '',});
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { handleToast } = useToast();
  const [loading, setLoading] = useState(false);

  router.on("start", () => setLoading(true));
  router.on("finish", () => setLoading(false));


  useEffect(() => {
    setTimeout(() => {
        setTitle("Submaster - BTO Status");
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
        const allItemIds = btoStatus?.data.map(item => item.id);
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
                            "/bto_status/bulkupdate",
                            {
                                ids: selectedItems,
                                status: actionType
                            }
                        );

                        if (response.data.status == "success") {
                            handleToast(response.data.message, response.data.status);

                            router.reload({ only: ["btoStatus"] });

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


  return (
    <>
      <Head title="BTO Status" />
      <ContentPanel>
        <TopPanel>
          <BulkActions actions={bulkActions} onActionSelected={handleActionSelected}></BulkActions>
          <TableSearch queryParams={queryParams} />
          <PerPage queryParams={queryParams} />
          <TableButton onClick={handleShowCreate}>
              Add BTO Status
          </TableButton>
          <Import importPath="/bto_status_import" templatePath="/bto_status_template" handleToast={()=>handleToast('Import Success', 'success')}/>
          <Export  path="/bto_status_export"/>
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
                  Status ID
              </TableHeader>
              <TableHeader name="status_name" queryParams={queryParams}>
                  Status Name
              </TableHeader>
              <TableHeader name="status" queryParams={queryParams}>
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
          <Tbody data={btoStatus.data}>
            {btoStatus && btoStatus.data.map((item) => (
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
                <RowStatus isLoading={loading} color={item.color} >
                    {item.status_name}
                </RowStatus>
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
                                status_name: item.status_name, 
                                status: item.status, 
                                color: item.color
                            });}}
                        action="edit"
                        size="md"
                    />
                </RowData>
              </Row>
            ))}
          </Tbody>
        </TableContainer>
        <Pagination paginate={btoStatus} onClick={resetCheckbox} />
      </ContentPanel>
      <Modal
          show={showCreate}
          onClose={handleShowCreate}
          title="Add BTO Status"
      >
        <BtoStatusForm 
          action="create"
          handleShow={()=>{
            handleShowCreate(); 
              handleToast("Created Status", "success");
          }}   
          />
      </Modal>
      <Modal
          show={showEdit}
          onClose={handleShowEdit}
          title="Edit BTO Status"
      >
        <BtoStatusForm 
          action="edit" 
          handleShow={()=>{
              handleShowEdit(); 
              handleToast("Updated Status", "success");
          }} 
          updateFormValues={updateFormValues} />
      </Modal>
    </>
  )
}

export default Status