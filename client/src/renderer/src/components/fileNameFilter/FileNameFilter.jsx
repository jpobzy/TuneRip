import React, { useRef } from 'react';
import { Space, Table, Popconfirm, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, ConfigProvider, Button, Flex, Tour } from 'antd';
import { App } from 'antd';
import './FileNameFilter.css'
import { QuestionOutlined  } from '@ant-design/icons';

import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';





function FileNameFilter({refreshRecords, setRefresh}){
  const [users, setUsers] = useState([]) // for user filter
  const [records, setRecords] = useState() // format: {1: [records]}
  const { message } = App.useApp();
  const [recordsToDelete, setRecordsToDelete] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [albumTitles, setAlbumTitles] = useState([])
  const [test, setTest] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const tableRef = useRef(null)
  const deleteSelectedButtonRef = useRef(null);
  const deleteSingleRecordRef = useRef(null);
  const [open, setOpen] = useState(false);


  const [searchText, setSearchText] = useState('');


  const steps = [
    {
      title: 'Downloads records table',
      description: 'This table will show all downloads and all filtered records',
      target: () => tableRef.current,
    },
    {
      title: 'Delete an individual record',
      description: 'Click on the delete button that corresponds with the records row and click on "yes" in the popup to delete it',
      target: () => deleteSingleRecordRef.current,
    },
    {
      title: 'Select multiple records',
      description: 'Select multiple records to be deleted, using the top checkbox at the top will only select the records on the current page',
       target: () => document.querySelector('.ant-table-selection-col'),
    },
    {
      title: 'Delete multiple records',
      description: 'After selecting multiple records delete, delete them',
      target: () => deleteSelectedButtonRef.current,
    },
    {
      title: 'Filter',
      description: 'Use the filter button to help with sorting for specific records',
       target: () => document.querySelector('.user-filter-column .ant-dropdown-trigger.ant-table-filter-trigger')
    }
  ] 



  const deleteSelected = async() => {
    setLoading(true)
    if (recordsToDelete.length === 0){
      message.info('No tracks was were selected');
    }else{
      const req = await axios.delete('http://localhost:8080/deleteMultipleRecord', {data: {'records': recordsToDelete}})
      if (req.status === 204){
        message.info('No track was found');
      }else if (req.status === 200){
        if (recordsToDelete.length > 1){
          message.success(`Selected records have been deleted`);       
        } else {
          message.success(`Selected record have been deleted`);
        }
        populateUsers();
        getCoverAlbums();
        getRecords();
      }      
      setSelectedRowKeys([])
    }
    setLoading(false)
  }


  const confirm = async (record) =>{
    setLoading(true)
    const req = await axios.delete('http://localhost:8080/deleteRecord', {data: {'link': record.link}})
    if (req.status === 204){
      message.info('No track was found');
    }else if (req.status === 200){
      message.success(`Record with URL ${record.link} has been deleted`)
      getRecords();
    }
    setLoading(false)
  };

  const cancel = () => {
    message.error('Canceled deletion');
  };









  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText('');
    confirm();
  };



  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button> */}
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });




























  const cols = [

    {
        title: 'Keyword',
        dataIndex: 'tracktitle',
        key: 'tracktitle',
          ...getColumnSearchProps('tracktitle'),
    },


  {
    title: <div ref={deleteSingleRecordRef}>Delete</div>,
    dataIndex: '',
    key: 'x',
    fixed: 'right',
      render: (_, record) => (
      <div >
        <Space size="middle">
          <Popconfirm
            title="Delete the record"
            description="Are you sure to delete this record?"
            onConfirm={() => confirm(record)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <a >Delete</a>
          </Popconfirm>
        </Space>        
      </div>

    ),

  },
  ]

  async function populateUsers(){
    const res = await axios.get('http://localhost:8080/getusers')
    setUsers(res.data)
  }

  async function getCoverAlbums(){
    const res = await axios.get('http://localhost:8080/getalbumtitles')
    setAlbumTitles(res.data)
  }

  async function getRecords(){
    // setRecords(null);
    const res = await axios.get('http://localhost:8080/getData',{
      params: {'page': 1, 'limit': 100}
    });
    setRecords(res.data);
  }
  
  useEffect(()=>{ 
    populateUsers();
    getCoverAlbums();
    getRecords();
    if (refreshRecords){
      getRecords();
      setRefresh(false)
    }
  },[refreshRecords])


  const handleFilters = (user, albumTitle)=>{
    if (user && !albumTitle){
      setSelectedUsers(user)
    }
    if (!user){
      setSelectedUsers([])
    }

    if (!user && !albumTitle){
      setSelectedUsers([])
    }
  }

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys)
    setRecordsToDelete(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

























  return (
    <div>
      <div className='-ml-[100px]'>
        <div className='relative right-[330px] h-[50px]'>
          <div className='flex justify-center'>
            <div ref={deleteSelectedButtonRef} className="inline-block ml-[130px] flex">
              <Popconfirm
              title="Delete the selected records"
              description="Are you sure to delete  the selected records?"
              onConfirm={() => deleteSelected()}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
              >
              <Button type="primary">
                {/* <Button type="primary" onClick={deleteSelected}> */}
                  Delete selected
                </Button>    
              </Popconfirm>
            </div>  
              <div className="flex ml-[5px]" >
                  <Tooltip title="help">
                      <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => setOpen(true)}/>
                  </Tooltip>                                    
              </div>      
          </div>
          </div>
          <div className='inline-block'>
            <div className='mx-auto ml-[50px] w-[800px]'>
                  <div ref={tableRef} >
                    <Table 
                        onChange={(pagination, filters, sorter, extra) => {
                          handleFilters(filters.user, filters.albumTitle)           
                        }}
                      selectedRowKeys={test}
                      rowSelection={rowSelection}
                      loading={isLoading}
                      columns={cols} 
                      dataSource={records} 
                      scroll={{ x: 'max-content' }}  
                      />;            
                  </div>
                </div>
          </div>
      </div>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  )

}


export default FileNameFilter;