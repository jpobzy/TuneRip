import React from 'react';
import { Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, ConfigProvider, Button } from 'antd';

function TrackTable(){

  const [users, setUsers] = useState([]) // for user filter
  const [records, setRecords] = useState() // format: {1: [records]}
  const [page, setPage] = useState(1)

  // const [pageSize, setPageSize] = useState(100)
  // const [totalRecords, setTotalRecords] = useState(0)
  // const [loading, setLoading] = useState(false)

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
    dataIndex: 'trackid',
    key: 'trackid'
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
    dataIndex: 'albumtitle',
    key: 'albumtitle'
  },
  {
    title: 'Action',
    dataIndex: '',
    key: 'x',
    fixed: 'right',
      render: (_, record) => (
      <Space size="middle">
        <a onClick={()=>deleteRecord(record)}>Delete</a>
      </Space>
    ),

  },
  ]

  function deleteRecord(record){
      console.log('hello world', record)


  }

  async function populateUsers(){
    const res = await axios.get('http://localhost:8080/getusers')
    setUsers(res.data)
  }

  async function getRecords(){
    const res = await axios.get('http://localhost:8080/getData',{
      params: {'page': 1, 'limit': 100}
    }
    )
    setRecords(res.data)
  }
  

  useEffect(()=>{ 
    populateUsers()
    getRecords()
  },[])

  function getMoreRecords(){
    console.log(records.length)
  }


  function helper(){
    console.log(records)
  }

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log('params', pagination);
    // console.log(pagination['current'])
    // console.log(records[pagination['current']])
    // console.log(records)
  
    // getMoreRecords()
  };

      const dataSource = Array.from({ length: 100 }).map((_, i) => ({
      key: i,
      user: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    }));

  return (
    <div>
      <div className='mx-auto w-[800px]'>
      <Table 
        columns={cols} 
        dataSource={records} 
        // dataSource={records[pagnation['current']]} 
        // pagination={true}
        scroll={{ x: 'max-content' }}  
        onChange={onChange}
        />;
      </div>

        {/* <Button type="primary" onClick={()=> helper()}>Go back</Button>, */}
    </div>
  )
}


export default TrackTable;