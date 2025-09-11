import React, { useRef } from 'react';
import { Space, Table, Popconfirm, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, ConfigProvider, Button, Flex, Tour } from 'antd';
import { App } from 'antd';
import './table.css'
import { QuestionOutlined  } from '@ant-design/icons';

function TrackTable({refreshRecords, setRefresh}){
  const [channels, setChannels] = useState([]) // for channel filter
  const [records, setRecords] = useState() // format: {1: [records]}
  const { message } = App.useApp();
  const [recordsToDelete, setRecordsToDelete] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [albumTitles, setAlbumTitles] = useState([])
  const [test, setTest] = useState([])
  const [selectedChannels, setSelectedChannels] = useState([])
  const tableRef = useRef(null)
  const deleteSelectedButtonRef = useRef(null);
  const deleteSingleRecordRef = useRef(null);
  const [open, setOpen] = useState(false);



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
       target: () => document.querySelector('.channel-filter-column .ant-dropdown-trigger.ant-table-filter-trigger')
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
        populateChannels();
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

  const filter = () => {
    if (selectedChannels.length > 0){
      const res = []
      for (var i = 0; i < selectedChannels.length; i++) {
        for (var j = 0; j < albumTitles.length; j++){
          if (albumTitles[j]['channel'] === selectedChannels[i]){
            res.push(albumTitles[j])
          }
        }
      }
      return res
    }else{
      return albumTitles
    }
  }

  const filterItems = (value, record) => {
    return record.channel.includes(value)
  }

  const cols = [
  {
    title: 'Channel',
    dataIndex: 'channel',
    key: 'channel',
    fixed: 'left',
    filters: channels,
    className: 'channel-filter-column',
    onFilter: filterItems
  },
  {
    title: 'Track title',
    dataIndex: 'tracktitle',
    key: 'tracktitle',
  },
  {
    title: 'Album Title',
    dataIndex: 'albumTitle',
    key: 'albumTitle',
    filters: filter(),
    onFilter: (value, record) => record.albumTitle.includes(value)
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
    title: 'File location',
    dataIndex: 'fileLocation',
    key: 'fileLocation'
  },
  {
    title: 'Cover Art File',
    dataIndex: 'coverArtFile',
    key: 'coverArtFile'
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

  async function populateChannels(){
    const res = await axios.get('http://localhost:8080/getchannels')
    setChannels(res.data)
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
    populateChannels();
    getCoverAlbums();
    getRecords();
    if (refreshRecords){
      getRecords();
      setRefresh(false)
    }
  },[refreshRecords])


  const handleFilters = (channel, albumTitle)=>{
    if (channel && !albumTitle){
      setSelectedChannels(channel)
    }
    if (!channel){
      setSelectedChannels([])
    }

    if (!channel && !albumTitle){
      setSelectedChannels([])
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
                          handleFilters(filters.channel, filters.albumTitle)           
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
      <Tour disabledInteraction={true} open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  )

}


export default TrackTable;