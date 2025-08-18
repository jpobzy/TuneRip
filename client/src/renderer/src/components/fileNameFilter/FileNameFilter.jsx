import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, App, Popconfirm, Table, Tooltip,  Tour, Space } from 'antd';
import axios from 'axios';
import './FileNameFilter.css'
import { QuestionOutlined  } from '@ant-design/icons';

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







const FileNameFilter = ({refreshRecords, setRefresh}) => {
  const [dataSource, setDataSource] = useState() // format: {1: [records]} 
  const [count, setCount] = useState();
  const [edit, setEdit] = useState()
  const [originalData, setOriginalData] = useState()
  const [open, setOpen] = useState(false);
  const addRowRef = useRef(null)
  const [existingRecordsAmount, setExistingRecordsAmount] = useState(0)
  const {message} = App.useApp();


  // search 
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef(null)

  const handleDelete = key => {
    setCount(count-1)
    const newData = dataSource.filter(item => item.key !== key);
    setDataSource(newData);
  };



  const tableRef = useRef(null)
  const deleteSelectedButtonRef = useRef(null);
  const deleteSingleRecordRef = useRef(null);
  const [isLoading, setLoading] = useState(false)

  const steps = [
    {
      title: 'Add phrases to be filtered out in track names when downloading',
      description: 'Add one or multiple phrases that will be removed from a video title when downloading',
      //  target: () => selectPlaylistsRef.current
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
    setDataSource(prev => {
      const newData = [...prev]
      newData[originalData.key].titleFilter = originalData.data
      return newData
    })
    setEdit(null)
    setOriginalData(null)
  }

  const saveEdit = async () =>{
    // #####################################################################################
    if (String(edit.data).includes('[Enter new data here]')){
      message.error('Please change the default input for adding a new record before saving')
      return
    }
    setLoading(true)
    console.log(`edit: ${JSON.stringify(edit)} \n with records amount = ${existingRecordsAmount}`)
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
    setOriginalData(null)
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
          {/* <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button> */}
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, close, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
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


  const defaultColumns = [
    {
        title: 'Keyword',
        dataIndex: 'titleFilter',
        key: 'titleFilter',
          ...getColumnSearchProps('titleFilter'),
        editable: true,
    },
    {
      title: <div ref={deleteSingleRecordRef}>Delete</div>,
      dataIndex: 'operation',
      key: 'x',
      // width: '20%',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <>
          {edit && edit.phrase === record.titleFilter ?
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
        setOriginalData({"key" : dataSource[index].key, "phrase" : dataSource[index].titleFilter})
      }

      if (newData[index].key > existingRecordsAmount){
        console.log('saving a record edit that doesnt exist in the current records')
        setEdit({'key' : newData[index].key, 
          'phrase' : newData[index].titleFilter
        })        
      }else{
        console.log('saving a record edit that already exists in the current records')
        setEdit({'key' : newData[index].key, 
          'phrase' : newData[index].titleFilter
        })
      }



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
  

  return (
    <>
      <div>
        <div className='inline-block' ref={addRowRef}>
          <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
            Add a row
          </Button>
        </div>


        <div className="flex -mt-[48px] mb-[30px] ml-[405px]" >
            <Tooltip title="help">
                <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => setOpen(true)}/>
            </Tooltip>                                    
        </div>          

        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          loading={isLoading}
        />
      </div>    
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </>
  );
};
export default FileNameFilter;




// use setCount/count to determine how many records are originally there when first get req is made to grab all records
// if you add multiple records then try and save one at the end without editing the others it gives an index error,
// if you try and delete a record that is not in the json file it errors out, - maybe have a second storage on front end and see if the deletion phrase is in it, if not then -
// delete the phrase, if its in it make the del req to backend