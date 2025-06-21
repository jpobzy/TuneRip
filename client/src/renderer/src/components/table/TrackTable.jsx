import React from 'react';
import { Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

// (user, albumTitle, trackName, trackId, status, albumCoverFile, link, whenRecordAdded)


const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    // render: text => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];


const olddata = [
  {
    key: '1',
    user: 'John Brown',
    albumtitle: 'test',
    tracktitle: 'New York No. 1 Lake Park',
    albumCoverFile:'aaaaaaaaaaaaaaaa',
    status:'filter',
    trackid: '123345',
    whenRecordAdded: 'dsamdasdaskmad',
    link: 'yt.com/12321321312'
  },
//   {
//     key: '2',
//     name: 'Jim Green',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sydney No. 1 Lake Park',
//   },
];


function TrackTable(){

  const [users, setUsers] = useState([])
  const [records, setRecords] = useState({}) // format: {1: [records]}
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
    render: () => <a>Delete</a>,
  },
  ]


  async function populateUsers(){
    const res = await axios.get('http://localhost:8080/getusers')
    setUsers(res.data)
  }

  async function getRecords(){
    const res = await axios.get('http://localhost:8080/getData',{
      params: {'page': 1, 'limit': 100}
    }
    )
    setRecords({1: res.data})
  }
  

  useEffect(()=>{ 
    populateUsers()
    getRecords()
  },[])

  function getMoreRecords(){
    console.log(records.length)
  }

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log('params', pagination);
    // console.log(pagination['current'])
    // console.log(records[pagination['current']])
    // console.log(records)
    
    setPage(pagination['current'])
    getMoreRecords()
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
        dataSource={records[page]} 
        // dataSource={records[pagnation['current']]} 
        pagination={true}
        scroll={{ x: 'max-content' }}  
        onChange={onChange}
        />;
      </div>
    </div>
  )
}


export default TrackTable;