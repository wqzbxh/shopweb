import React, { useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from 'mantine-react-table';
import { ActionIcon, Box, Button, LoadingOverlay, Modal, Text, Tooltip, useMantineColorScheme } from '@mantine/core';
import { apiTimeTracker, apiUser, apiUserList } from '../../../api';
import { IconEdit, IconFileDots, IconTrash } from '@tabler/icons-react';

import { useDisclosure } from '@mantine/hooks';
import { Iuser } from '../../../interface/Iuser';
import { getAllRoleSelect, getUserListSelect } from '../../../utils/AccessInformation';
import { SelectPullDown } from '../../../interface/Icommon';
import { DaleteData, HintInfo } from '../../../utils/function';
import ProjectForm from './ProjectForm';
import { IProject } from '../../../interface/ItimeProject';
import Detail from './Detail';



const Project = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  //data and fetching state
  const [data, setData] = useState<IProject[]>([]);
  // 数据加载失败显示隐藏
  const [isError, setIsError] = useState(false);
  //等待条
  const [isLoading, setIsLoading] = useState(false);
  // 加载条显示
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [RoleSelect, setRoleSelect] = useState<SelectPullDown[]>([]);
  const [UserListSelect, SetUserListSelect] = useState<SelectPullDown[]>([]);
    // 打开用户编辑添加框
    const [ProjectFromStatus, {open:openProjectFrom,close:closeProjectFrom}] = useDisclosure(false);
  // 打开用户编辑添加框
  const [ProjectDetailStatus, {open:openProjectDetail,close:closeProjectDetail}] = useDisclosure(false);
  
  const [visible, setVisible] = useState(false);
  // 定义表单标题
  const [formTitle, setFormTitle] = useState("");
  //table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  // 定义传入表单的初始化数据
  // 定义角色单条数据

  // 'id' => (string)$this->id,
  // 'name' => $this->name,
  // 'project_no' => $this->project_no,
  // 'start_date' => $this->start_date,
  // 'info' => $this->info,
  // 'customer_name' => $this->customer_name,


  const [projectItem, SetProjectItem] =
    useState<IProject>({
      id: "",
      name: "",
      project_no:"",
      start_date:"",
      customer_name:"",
      time_estimate:"",
      info:"",
    });

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

    // 初始化商品类型列表
    const ajaxGetData = async () => {
       
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

     const paginations =  {
        start:  `${pagination.pageIndex * pagination.pageSize}`,
        size: `${pagination.pageSize}`,
        filters: JSON.stringify(columnFilters ?? []),
        globalFilter: globalFilter ?? '',
        sorting:  JSON.stringify(sorting ?? []),
      }
      try {
       
        const ProjectDataResponese = await apiTimeTracker(paginations, "GET");
        console.log(ProjectDataResponese.data.data.data)
        setData(ProjectDataResponese.data.data.data);
        setRowCount(ProjectDataResponese.data.data.total);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
      };
    
  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    ajaxGetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
  ]);

    // 打开添加类型模态框
  const openProjectFromHandler =  async (value: string) => {
      if (value == "create")
      SetProjectItem({
        id: "",
        name: "",
        project_no:"",
        start_date:"",
        customer_name:"",
        time_estimate:'',
        info:""
        });
      const RoleSeletOption =  await getAllRoleSelect({type:'select'});
      setRoleSelect(RoleSeletOption.data)
      setFormTitle("新建记录项目");
      openProjectFrom()
    };
// 表单操作后的回调
  const callbackHandle=()=>{
    ajaxGetData();
    closeProjectFrom();
    closeProjectDetail();
  }

const editData = async(row:any)=>{
    SetProjectItem(row);
    setFormTitle("编辑项目信息(ID:" + row.id + ")");
    openProjectFrom()
};  
// 查看祥请

const detailView = async(row:any)=>{
  SetProjectItem(row);
  const UserList  = await  getUserListSelect({type:'select'});
  SetUserListSelect(UserList);
  openProjectDetail()
};  

const handleDeleteRow = (row: any) => {
  const Info = <Text size='md' color='dark'>项目：{row.name}</Text>;
  DaleteData(Info, async () => {    // 调用异步请求的逻辑
    const response = await apiTimeTracker({id:row.id}, "DELETE");
    const result = response.data; // 返回请求结果
    if(HintInfo(result)) ajaxGetData();
  });
};
  const columns = useMemo<MRT_ColumnDef<IProject>[]>(
    () => [
     {
        accessorKey: 'name',
        header: '项目名称',
      },
      //column definitions...
      {
        accessorKey: 'project_no',
        header: ' 项目编号',
      },
      {
        accessorKey: 'start_date',
        header: '开始时间',
      },
      {
        accessorKey: 'time_estimate',
        header: '预计花销',
      },
      {
        accessorKey: 'customer_name',
        header: '客户名称',
      },
      {
        accessorKey: 'info',
        header: '描述',
      },
      //end
    ],
    [],
  );
 
  return (
    <Box p={20} w="100%">
    <LoadingOverlay visible={visible} overlayBlur={2} />
    <MantineReactTable
      columns={columns}
      data={data}
      getRowId={(row) => row.phone}
      initialState={{ showColumnFilters: true,
        columnOrder: [
        "mrt-row-actions",
        "name",
        "customer_name",
        "project_no",
        "start_date",
        "time_estimate",
        "info",
      ], }}
      manualFiltering
      manualPagination
      manualSorting
      displayColumnDefOptions={{
        'mrt-row-actions': {
          header: '操作', //change header text
        },
      }}
      mantineToolbarAlertBannerProps={
        isError
          ? {
              color: 'red',
              children: 'Error loading data',
            }
          : undefined
      }
      enablePinning
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      rowCount={rowCount}
      enableEditing
      state={{
        columnFilters,
        globalFilter,
        isLoading,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isRefetching,
        sorting,
      }}
      renderRowActions={({ cell, row, table }) => (
        <Box sx={{ display: "flex", gap: "16px" }}>
          <Tooltip withArrow position="left" label="Edit" onClick={() => editData(row.original)}>
            <ActionIcon >
              <IconEdit size="1.2rem" slope={1.5} />
            </ActionIcon>
          </Tooltip>
          
          <Tooltip withArrow position="left" label="Edit" onClick={() => detailView(row.original)}>
            <ActionIcon >
              <IconFileDots size="1.2rem" color='green' slope={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip withArrow position="right" label="Delete" onClick={() =>handleDeleteRow(row.original)}>
            <ActionIcon color="red" >
              <IconTrash size="1.2rem" slope={1.5} />
            </ActionIcon>
          </Tooltip>
        </Box>
      )}
      renderTopToolbarCustomActions={() => (
        <Button
          color={dark?'blue':'dark'}
          variant="outline"
          onClick={() => openProjectFromHandler("create")}
        >
         添加记录项目
        </Button>
      )}
    />
    

    <Modal opened={ProjectFromStatus} size='xs' onClose={closeProjectFrom}  title={<Text fw={700}>{formTitle}</Text>}>
           <ProjectForm  callback={callbackHandle}  projectItem={projectItem}/>
      </Modal>
      
      <Modal opened={ProjectDetailStatus} size='50%' onClose={closeProjectDetail}  title={<Text fw={700}>{formTitle}</Text>}>
           <Detail  callback={callbackHandle} userList={UserListSelect}  projectItem={projectItem}/>
      </Modal>
    </Box>


  );
};

export default Project;