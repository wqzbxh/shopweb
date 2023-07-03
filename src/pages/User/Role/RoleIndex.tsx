import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from 'mantine-react-table';
import { ActionIcon, Box, Button, LoadingOverlay, Modal, Text, Tooltip, useMantineColorScheme } from '@mantine/core';
import { apiGetMenu, apiUserList, apiUserRole } from '../../../api';
import { IconCheck, IconEdit, IconTrash, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Irole, MenuItem, MenuProps } from '../../../interface/Irole';
import { RoleForm } from './RoleForm';
import { DaleteData, HintInfo } from '../../../utils/function';
import { notifications } from '@mantine/notifications';


export default function RoleIndex(){
    
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  //data and fetching state
  const [data, setData] = useState<Irole[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  
  const [RoleFormStatus, {open:openRoleForm,close:closeRoleForm}] = useDisclosure(false);
  // 定义角色单条数据
  const [roleItem, SetRoleItem] =
    useState<Irole>({
      id: "",
      menu_id: [],
      role_name: "",
      desc: "",
    });

    // 定义单个菜单集合
    
  const [menuId, setMenuId] = useState<string[]>([]);
  // 定义表单标题
  const [formTitle, setFormTitle] = useState("");
//   const
  const [MenuItem, SetMenuItem] = useState<MenuItem[]>([]);

  const [visible, setVisible] = useState(false);
  //table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  

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
        const UserRoleesponese = await apiUserRole(paginations, "GET");
        console.log(UserRoleesponese.data.data.data)
        setData(UserRoleesponese.data.data.data);
        setRowCount(UserRoleesponese.data.data.total);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
      };
    // 定义打开编辑
    const editData = (row:Irole)=>{
        SetRoleItem(row);
        setFormTitle("编辑用户角色(ID:" + row.id + ")");
        setMenuId(row.menu_id)
        getMenuInfo();
        openRoleForm()
     
    };  
        // 打开添加类型模态框
  const openRoleFormHandler =  (value: string) => {
    if (value == "create")
    SetRoleItem({
        id: "",
        menu_id: [],
        role_name: "",
        desc: "",
      });
    getMenuInfo();
    setFormTitle("新建角色类型");
  };

  // 请求菜单信息
  const getMenuInfo =async()=>{
    const MenuResponese = await apiGetMenu({}, "GET");
    console.log(MenuResponese.data.data)
    if(MenuResponese.data.code === 200 ){
        SetMenuItem(MenuResponese.data.data)
        openRoleForm();
    }else{
        //准备失败
    }

  }
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

  const columns = useMemo<MRT_ColumnDef<Irole>[]>(
    () => [
      {
        accessorKey: 'id',
        header: '编号',
      },{
        accessorKey: 'role_name',
        header: '角色名称',
      },
      //column definitions...
      {
        accessorKey: 'desc',
        header: ' 角色简介',
      }
     
      //end
    ],
    [],
  );

    
const handleDeleteRow = (row: Irole) => {
  const Info = <Text>用户角色：{row.role_name}</Text>;
  DaleteData(Info, async () => {    // 调用异步请求的逻辑
    const response = await apiUserRole({id:row.id}, "DELETE");
    const result = response.data; // 返回请求结果
    if(HintInfo(result)) ajaxGetData();
  });
};

const callbackHandle=()=>{
  ajaxGetData();
  closeRoleForm();
}
  return (
    <Box p={20} w="100%">
    <LoadingOverlay visible={visible} overlayBlur={2} />
    <MantineReactTable
      columns={columns}
      data={data}
      getRowId={(row) => row.id}
      initialState={{ showColumnFilters: true,
        columnOrder: [
        "id",
        "role_name",
        "desc",
        "mrt-row-actions",
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
          onClick={() => openRoleFormHandler("create")}
        >
         添加用户角色
        </Button>
      )}
      
    />
     <Modal opened={RoleFormStatus} size='xl' onClose={closeRoleForm}  title={<Text fw={700}>{formTitle}</Text>}>
           <RoleForm callback={callbackHandle} roleItem={roleItem} menuIdArr={menuId} MenuItem={MenuItem}/>
      </Modal>
    </Box>
  );
};