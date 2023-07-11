import React, { useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from 'mantine-react-table';
import { ActionIcon, Box, Button, LoadingOverlay, Modal, Text, Tooltip, useMantineColorScheme } from '@mantine/core';
import { apiUser, apiUserList } from '../../../api';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import UserForm from '../../User/User/UserForm';
import { useDisclosure } from '@mantine/hooks';
import { Iuser } from '../../../interface/Iuser';
import { SelectPullDown } from '../../../interface/Icommon';
import { DaleteData, HintInfo } from '../../../utils/function';
import GoodsForm from './GoodsForm';


type User = {
  id:string;
  email: string;
  name: string;
  realname: string;
  idcard: string;
  phone: string;
};

const Goods = () => {
  
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  //data and fetching state
  const [data, setData] = useState<User[]>([]);
  // 数据加载失败显示隐藏
  const [isError, setIsError] = useState(false);
  //等待条
  const [isLoading, setIsLoading] = useState(false);
  // 加载条显示
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [goodsCateGorySelect, setgoodsCateGorySelect] = useState<SelectPullDown[]>([]);
  const [goodsTypeSelect, setgoodsTypeSelect] = useState<SelectPullDown[]>([]);
  // 打开用户编辑添加框
  const [GoodsFormStatus, {open:openGoodsForm,close:closeGoddsForm}] = useDisclosure(false);
  
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
  const [userItem, SetUserItem] =
    useState<Iuser>({
      id: "",
      name: "",
      password:"",
      role_id:"",
      email:"",
      confirm_password:"",
      realname:"",
      idcard:"",
      status:'1',
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
       
        const goodsCategoryDataResponese = await apiUserList(paginations, "GET");
        console.log(goodsCategoryDataResponese.data.data.data)
        setData(goodsCategoryDataResponese.data.data.data);
        setRowCount(goodsCategoryDataResponese.data.data.total);
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
  const openGoodsFormHandler =  async (value: string) => {
      if (value == "create")
      SetUserItem({
          id: "",
          name: "",
          password:"",
          confirm_password:"",
          email:"",
          realname:"",
          role_id:"",
          idcard:"",
          status:'1',
        });
      setFormTitle("新建商品");
      openGoodsForm()
    };
// 表单操作后的回调
  const callbackHandle=()=>{
    ajaxGetData();
    closeGoddsForm();
  }

  const editData = async(row:any)=>{
    SetUserItem(row);
    setFormTitle("编辑用户信息(ID:" + row.id + ")");
    openGoodsForm()
};  
const handleDeleteRow = (row: any) => {
  const Info = <Text size='md' color='dark'>用户：{row.name}</Text>;
  DaleteData(Info, async () => {    // 调用异步请求的逻辑
    const response = await apiUser({id:row.id}, "DELETE");
    const result = response.data; // 返回请求结果
    if(HintInfo(result)) ajaxGetData();
  });
};
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: '编号',
      },{
        accessorKey: 'email',
        header: '账号',
      },
      //column definitions...
      {
        accessorKey: 'name',
        header: ' 名称',
      },
      {
        accessorKey: 'phone',
        header: '手机号',
      },
      {
        accessorKey: 'idcard',
        header: '身份证号',
      },
      {
        accessorKey: 'realname',
        header: '真实姓名',
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
        initialState={{
          showColumnFilters: true,
          columnOrder: [
            "id",
            "name",
            "email",
            "phone",
            "idcard",
            "realname",
            "mrt-row-actions",
          ],
        }}
        manualFiltering
        manualPagination
        manualSorting
        displayColumnDefOptions={{
          "mrt-row-actions": {
            header: "操作", //change header text
          },
        }}
        mantineToolbarAlertBannerProps={
          isError
            ? {
                color: "red",
                children: "Error loading data",
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
            <Tooltip
              withArrow
              position="left"
              label="Edit"
              onClick={() => editData(row.original)}
            >
              <ActionIcon>
                <IconEdit size="1.2rem" slope={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip
              withArrow
              position="right"
              label="Delete"
              onClick={() => handleDeleteRow(row.original)}
            >
              <ActionIcon color="red">
                <IconTrash size="1.2rem" slope={1.5} />
              </ActionIcon>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color={dark ? "blue" : "dark"}
            variant="outline"
            onClick={() => openGoodsFormHandler("create")}
          >
            添加商品
          </Button>
        )}
      />

      <Modal
        opened={GoodsFormStatus}
        size="xl"
        fullScreen
        transitionProps={{ transition: 'fade', duration: 200 }}
        onClose={closeGoddsForm}
        title={<Text fw={700}>{formTitle}</Text>}
      >
        {/* <GoodsForm goodsCateGorySelect={goodsCateGorySelect} callback={callbackHandle} infoItem={userItem} /> */}
        <GoodsForm
          goodsCategory={goodsCateGorySelect}
          callback={callbackHandle}
          goodsType={goodsTypeSelect}
        />
      </Modal>
    </Box>
  );
};

export default Goods;