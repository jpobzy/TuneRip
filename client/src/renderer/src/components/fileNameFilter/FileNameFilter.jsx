import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, message, Popconfirm, Table, Tooltip,  Tour } from 'antd';
import axios from 'axios';
import { App } from 'antd';
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

  const handleDelete = key => {
    setCount(count-1)
    const newData = dataSource.filter(item => item.key !== key);
    setDataSource(newData);
  };



  const tableRef = useRef(null)
  const deleteSelectedButtonRef = useRef(null);
  const deleteSingleRecordRef = useRef(null);
  const [isLoading, setLoading] = useState(false)


  const confirm = async (record) =>{
    console.log(`record: ${record.titleFilter}`)
    // setLoading(true)
    // const req = await axios.delete('http://localhost:8080/deleteWord', {data: {'titleFilter': record.titleFilter}})
    // if (req.status === 204){
    //   message.info('No track was found');
    // }else if (req.status === 200){
    //   message.success(`Record with URL ${record.link} has been deleted`)
    //   getRecords();
    // }
    // setLoading(false)
  };

  const cancel = () => {
    // message.error('Canceled deletion');
  };

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

  async function getRecords(){
    const res = await axios.get('http://localhost:8080/filterWords');
    setDataSource(res.data);
    setCount(res.data.length)
  }
  
  useEffect(()=>{ 
    getRecords();
    if (refreshRecords){
      getRecords();
      setRefresh(false)
    }
  },[refreshRecords])


  const cancelEdit = () =>{
    // console.log(`current edit is ${editMade}`)
    // setEditMade(null)
    setDataSource(prev => {
      const newData = [...prev]
      newData[originalData.key].titleFilter = originalData.data
      return newData
    })
    setEdit(null)
    setOriginalData(null)
  }

  const saveEdit = async () =>{
    if (String(edit.data).includes('[Enter new data here]')){
      message.error('Please change the default input for adding a new record before saving')
      return
    }

    const req = await axios.put('http://localhost:8080/editTitleFilter', {data : edit})

    setLoading(false)
    setEdit(null)
    setOriginalData(null)
  }




  const defaultColumns = [
    {
        title: 'Keyword',
        dataIndex: 'titleFilter',
        key: 'titleFilter',
          // ...getColumnSearchProps('titleFilter'),
        editable: true,
    },
    {
      title: <div ref={deleteSingleRecordRef}>Delete</div>,
      dataIndex: 'operation',
      key: 'x',
      width: '20%',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <>
          {edit && edit.data === record.titleFilter ?
            <>
              <a onClick={()=> saveEdit()} className='mr-[20px]'>Save</a>
              <a onClick={()=> cancelEdit()}>Cancel</a>
            </>
          :
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

    // if (item.titleFilter === '[Enter new data here]'){
    //   console.log('editing new item')
      
    // }else{
      console.log(`index: ${index}`)
      if (edit && edit.key !== index){
        console.log('trying to edit another cell without saving')
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
        setOriginalData({"key" : dataSource[index].key,"data" : dataSource[index].titleFilter})
      }


      setEdit({'key' : newData[index].key, 
        'data' : newData[index].titleFilter
     
      })

      console.log('saving changes')
      console.log(newData[index].titleFilter)
      setDataSource(newData);
    // }
    console.log('\n\n')
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
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          loading={isLoading}
        />
      </div>    

      {/* <Button onClick={()=> console.log(edit)}>edit</Button>
      <Button onClick={()=> console.log(originalData)}>original</Button> */}
      
    </>

  );
};
export default FileNameFilter;