import React, { useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from 'mantine-react-table';
import { ActionIcon, Box, Button, LoadingOverlay, Tooltip } from '@mantine/core';
import { apiUserList } from '../../api';
import { IconEdit, IconTrash } from '@tabler/icons-react';

type UserApiResponse = {
  data: Array<User>;
  meta: {
    totalRowCount: number;
  };
};

type User = {
  id:string;
  email: string;
  name: string;
  realname: string;
  idcard: string;
  phone: string;
};

const UserIndex = () => {
  //data and fetching state
  const [data, setData] = useState<User[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

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
      initialState={{ showColumnFilters: true,
        columnOrder: [
        "id",
        "name",
        "email",
        "phone",
        "idcard",
        "realname",
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
          <Tooltip withArrow position="left" label="Edit">
            <ActionIcon >
              <IconEdit size="1.2rem" slope={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip withArrow position="right" label="Delete">
            <ActionIcon color="red" >
              <IconTrash size="1.2rem" slope={1.5} />
            </ActionIcon>
          </Tooltip>
        </Box>
      )}
      renderTopToolbarCustomActions={() => (
        <Button
          color="dark.4"
          variant="filled"
        >
         添加用户
        </Button>
      )}
    /></Box>
  );
};

export default UserIndex;