import React, { use, useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, App, Popconfirm, Table, Tooltip,  Tour, Space, Radio, Select, Result } from 'antd';
import axios from 'axios';
import './PhraseFilter.css'
import { QuestionOutlined  } from '@ant-design/icons';
import { resultToggle } from '../context/ResultContext';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';



const EditableContext = React.createContext(null);


const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};


const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};







const TitleFilter = ({refreshRecords, setRefresh}) => {
  const [dataSource, setDataSource] = useState() // format: {1: [records]} 
  const [count, setCount] = useState();
  const [edit, setEdit] = useState()
  const [originalData, setOriginalData] = useState()
  const [openTableTour, setTableTourOpen] = useState(false);
  const [openApplyTour, setApplyTourOpen] = useState(false);
  const addRowRef = useRef(null)
  const [existingRecordsAmount, setExistingRecordsAmount] = useState(0)
  const {message} = App.useApp();


  // search 
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef(null)

  const selectRef = useRef(null)
  const saveRef = useRef(null);
  const deleteRecordRef = useRef(null);
  const [isLoading, setLoading] = useState(false)

  const tableSteps = [
    {
      title: 'Add phrases to be filtered out in track names when downloading',
      description: 'Add one or multiple phrases that will be removed from a video title when downloading',

    },
    {
      title: 'Add a row to add a new phrase',
      description: "Create a new row then edit the row to add a new phrase",
       target: () => addRowRef.current
    },
    {
      title: 'Search for a phrase',
      description: "Search for a specific phrase to edit or delete",    
      // target: () => searchRef.current  
      target: () => document.querySelector('.ant-table-wrapper .ant-table-filter-trigger')
    },
    {
      title: 'Save/Cancel',
      description: 'After editing click on save or cancel to save or cancel your edits',
      //  target: () => submitPlaylistsRef.current
    },
    {
      title: 'Delete',
      description: 'Click on the delete button that corresponds with the records row and then click on "yes" in the popup to delete it',
       target: () => document.querySelector('.deleteColumn')
    },
  ]


  const applySteps = [
    {
      title: 'Select a folder',
      description: 'Select a folder in downloads to remove all phrases in each files title and file name from the phrase filter table',
      target: () => selectRef.current
    },
    {
      title: 'Save',
      description: "Click to start the removal process",
      target: () => saveRef.current
    },
  
  ]

  const help = (i, v) => {
    return i != v
  }


  const confirmDeletion = async (record) =>{
    if (record.key > existingRecordsAmount){
      setDataSource(dataSource.filter((i)=> help(i, record)))
      return
    }
    setLoading(true)
    const req = await axios.delete('http://localhost:8080/deleteTitleFilter', {data: {'titleFilter': record.titleFilter}})
    if (req.status === 204){
      message.info('No record was found');
    }else if (req.status === 200){
      message.success(`Record ${record.titleFilter} has been deleted`)
      getRecords();
    }
    setLoading(false)
  };

  const cancelDeletion = () => {
    message.error('Canceled deletion');
  };


  async function getRecords(){
    const res = await axios.get('http://localhost:8080/filterWords');
    setOriginalData(res.data)
    setDataSource(res.data);
    setCount(res.data.length)
    setExistingRecordsAmount(res.data.length - 1)
  }
  
  useEffect(()=>{ 
    getRecords();
    if (refreshRecords){
      getRecords();
      setRefresh(false)
    }
  },[refreshRecords])


  const cancelEdit = () =>{
    setEdit(null)
  }

  const saveEdit = async () =>{
    // #####################################################################################

    setLoading(true)
    if (edit.key <= existingRecordsAmount){
      const req = await axios.put('http://localhost:8080/editTitleFilter', {data : edit}) 
      if (req.status === 200){
        message.success('Successfully modified existing record')
      }else{
        message.error('Something went wrong')
      }
    }else{
      console.log('adding new record')
      const req = await axios.post('http://localhost:8080/addTitleFilter', {data : edit}) 
      if (req.status === 200){
        message.success('Successfully added new record')
      }else{
        message.error('Something went wrong')
      }
    }
    getRecords()
    setLoading(false)
    setEdit(null)
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  
  const handleReset = (clearFilters, close, confirm) => {
    clearFilters();
    setSearchText(null);
    setSearchedColumn('')
    confirm();
    close()
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()} >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <div className='inline-block' ref={searchRef}>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
          </div>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, close, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
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


  const defaultColumns = [
    {
        title: 'Keyword',
        dataIndex: 'titleFilter',
        key: 'titleFilter',
          ...getColumnSearchProps('titleFilter'),
        editable: true,
    },
    {
      // title: 'Delete',
      title: <div className='deleteColumn' ref={deleteRecordRef}>Delete</div>,
      dataIndex: 'operation',
      key: 'x',
      width: '20%',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <>
          {edit && edit.phrase === record.titleFilter && edit.key === record.key ?
            <>
              <a onClick={()=> saveEdit()} className='mr-[20px]'>Save</a>
              <a onClick={()=> cancelEdit()}>Cancel</a>
            </>
          :
            <Popconfirm
              title="Delete the record"
              description="Are you sure to delete this record?"
              onConfirm={() => confirmDeletion(record)}
              onCancel={cancelDeletion}
              okText="Yes"
              cancelText="No"
            >
              <a >Delete</a>
            </Popconfirm>
          }

          </>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData = {
      key: count,
      titleFilter: `[Enter new data here]`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
    
    const page = Math.ceil((dataSource.length + 1)  / 10)
    setPaginationPage(page)
  };

  const handleSave = row => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });

      if (edit && edit.key !== index){
        console.log('trying to edit another cell without saving')
        message.error('Please save or cancel previous edit before trying to edit a new cell')
        return
      }
      if (newData[index].titleFilter === item.titleFilter){
        if (edit){
          console.log('no new changes were made to the record being currently edited')
          return
        }
        console.log('no new changes were made')
        setEdit(null)
        return
      }
      if (!edit){
        if (newData[index].titleFilter.trim().length === 0){
          console.log('only white space')
          return
        }
      }

      if (Object.values(originalData).filter(x => x.titleFilter === row.titleFilter).length > 0){
        message.error('Phrase already exists1')
        return
      }  


      setEdit({'key' : newData[index].key, 
        'phrase' : newData[index].titleFilter
      })
      setDataSource(newData);
  };


  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  

  // add section
  const [mode, setMode] = useState('table')
  const [existingPlaylistNames, setExistingPlaylistNames] = useState(null)
  const [playlist, setPlaylistChosen] = useState(null)
  const [applyLoading, setApplyLoading] = useState(false)
  const [resultStatusCode, setResultStatusCode] = useState()
  const [showResult, setShowResult] = useState(false)

  const {ResultSuccess, ResultWarning, Loading, ResultError} = resultToggle()

  const options = [
  { label: 'Table', value: 'table' },
  { label: 'Apply filter', value: 'applyFilter' },
  ];


  const getExistingPlaylists = async ()=>{
      const req = await axios.get('http://localhost:8080/getallfoldernamesindownloads');
      setExistingPlaylistNames(req.data)
  }

  useEffect(()=>{
    getExistingPlaylists();
    
  }, [])

  const goBack = () => {
    setApplyLoading(false)
    setShowResult(false)  
  }

  const playlistChoseon = (e) => {
    setPlaylistChosen(e)
  }
 

  async function handleApplyFilter(){
    setApplyLoading(true)
    const req = await axios.post('http://localhost:8080/apply-filters-to-folder', {'playlist' : playlist})

    if (req.status === 200){
      setResultStatusCode(200)
      setApplyLoading(false)
    }else{
      setResultStatusCode(400)
    }
    setApplyLoading(false)
    setShowResult(true)
    setPlaylistChosen(null)
  }

  const [currentPaginationPage, setCurrentPaginationPage] = useState(1)

  function setPaginationPage(e){
    setCurrentPaginationPage(e)
  }

  function handleOpenTour(){
    if (mode === 'table'){
      setTableTourOpen(true)
    }else{
      setApplyTourOpen(true)
    }

  }


  return (
    <>
      <div className='mb-[30px]'>
        {!applyLoading && !showResult &&
          <>
            <div className='mx-auto justify-center flex mt-[30px] mb-[20px]'>       
              <Radio.Group block options={options} value={mode} optionType="button" buttonStyle="solid" style={{width: 300}} onChange={(e)=>setMode(e.target.value)}/> 
            </div>     
            <div className='absolute font-[15px] text-red-500 ml-[160px] -mt-[45px]'>
              NEW
            </div>
            <div className="flex -mt-[52px] mb-[30px] ml-[505px]" >
                <Tooltip title="help">
                    <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => handleOpenTour()}/>
                </Tooltip>                                    
            </div>                       
          </>
        }

        {mode === 'table' &&
        <>
          <div>
            <div className='inline-block' ref={addRowRef}>
              <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                Add a row
              </Button>
            </div>
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={dataSource}
              columns={columns}
              loading={isLoading}
              pagination={{current : currentPaginationPage, onChange : (page) => {
                setPaginationPage(page)
              }}}
            />          
          </div>        
        </>
        }

        {mode === 'applyFilter' && existingPlaylistNames &&
          <>
            {!applyLoading && !showResult && 
            <>
              <div className="inline-block" ref={selectRef}>
                  <Select
                      allowClear={true}
                      defaultValue={[]}
                      style={{ width: 500 }}
                      onChange={(e) => playlistChoseon(e)}
                      options={existingPlaylistNames}
                  />                               
              </div>  
              {playlist && 
                <>
                  <div>
                    <div className='mt-[20px] inline-block' ref={saveRef}>
                      <Button onClick={()=> handleApplyFilter()} >Save</Button>
                    </div>                   
                  </div>
                </>
              }
            </>
            }
            {applyLoading && !showResult && 
              <>
                <div className="mt-[100px]">
                  {Loading('Filters are being appended?')}
                </div>
              </>
            } 
            {!applyLoading && showResult && 
              <>
                <div className="bg-white rounded-xl inline-block">
                  {resultStatusCode === 200  && ResultSuccess('Successfully removed all phrases from the phrase table to all files in the folder', '', goBack)}
                  {resultStatusCode === 400  && ResultFailed('Something went wrong', 'Please check the log folder', goBack)}                         
                </div>
              </>
            }   
          </>
        }
      </div>    
      <Tour disabledInteraction={true} open={openTableTour} onClose={() => setTableTourOpen(false)} steps={tableSteps} />
      <Tour disabledInteraction={true} open={openApplyTour} onClose={() => setApplyTourOpen(false)} steps={applySteps} />
    </>
  );
};
export default TitleFilter;




