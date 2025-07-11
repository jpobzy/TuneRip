import React, { use } from 'react';
import { Space, Table, Popconfirm, Switch } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, ConfigProvider, Button, Flex } from 'antd';
import { App } from 'antd';


function TrackTable({refreshRecords, setRefresh}){
  const [users, setUsers] = useState([]) // for user filter
  const [records, setRecords] = useState() // format: {1: [records]}
  const { message } = App.useApp();
  const [recordsToDelete, setRecordsToDelete] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const deleteSelected = async() => {
    setLoading(true)
    const req = await axios.delete('http://localhost:8080/deleteMultipleRecord', {data: {'records': recordsToDelete}})
    console.log(req.status)
    if (req.status === 204){
      message.info('No track was found');
    }else if (req.status === 200){
      if (recordsToDelete.length > 1){
        message.success(`Selected records have been deleted`);       
      } else {
        message.success(`Selected record have been deleted`);
      }
      getRecords();
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
    message.error('clicked on cancel');
  };


  const cols = [
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
    fixed: 'left',
    filters: users,
    onFilter: (value, record) => record.user.includes(value),
  },
  {
    title: 'Track title',
    dataIndex: 'tracktitle',
    key: 'tracktitle'
  },
  {
    title: 'Link',
    dataIndex: 'link',
    key: 'link'
  },
  {
    title: 'When added',
    dataIndex: 'whenRecordAdded',
    key: 'whenRecordAdded'
  },
  {
    title: 'Track Id',
    dataIndex: 'trackId',
    key: 'trackId'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Album Cover File',
    dataIndex: 'albumCoverFile',
    key: 'albumCoverFile'
  },
  {
    title: 'Album Title',
    dataIndex: 'albumTitle',
    key: 'albumTitle'
  },
  {
    title: 'Action',
    dataIndex: '',
    key: 'x',
    fixed: 'right',
      render: (_, record) => (
      <Space size="middle">
      <Popconfirm
        title="Delete the task"
        description="Are you sure to delete this task?"
        onConfirm={() => confirm(record)}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <a >Delete</a>
      </Popconfirm>
      </Space>
    ),

  },
  ]

  async function populateUsers(){
    const res = await axios.get('http://localhost:8080/getusers')
    setUsers(res.data)
  }

  async function getRecords(){
    const res = await axios.get('http://localhost:8080/getData',{
      params: {'page': 1, 'limit': 100}
    });
    setRecords(res.data);
  }
  
  useEffect(()=>{ 
    populateUsers();
    getRecords();
    if (refreshRecords){
      getRecords();
      setRefresh(false)
    }
  },[refreshRecords])


  const rowSelection = {

    onChange : (selectedRowKeys, selectedRows) => {
      console.log('selectedRowKeys changed: ', selectedRows);
      setRecordsToDelete(selectedRows);
    } 
  }


  return (
    <div>
      <div className=''>
        <div className='relative right-[330px] h-[50px]'>
            <Button type="primary" onClick={deleteSelected}>
              Delete selected
            </Button>            
        </div>
 

       

        <div className='mx-auto  w-[800px]'>
          <Table 
            rowSelection={Object.assign({ type: 'checkbox'}, rowSelection)}
            loading={isLoading}
            columns={cols} 
            dataSource={records} 
            scroll={{ x: 'max-content' }}  
            />;
        </div>

      </div>
    </div>
  )
}


export default TrackTable;