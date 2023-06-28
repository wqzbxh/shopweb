import React, { useCallback, useEffect, useMemo, useState } from "react";
import { modals } from "@mantine/modals";

import {
  MantineReactTable,
  MantineReactTableProps,
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
} from "mantine-react-table";
import {
  Box,
  Button,
  Dialog,
  Flex,
  Title,
  ActionIcon,
  Menu,
  Stack,
  TextInput,
  Tooltip,
  Modal,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { IconTrash, IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import CateGoryFrom from "./CateGoryFrom";
import { useDisclosure } from "@mantine/hooks";
import { apiGoodsCategory } from "../../../api";
import {
  ApiDataGoodsCategory,
  ApiResponseGoodsCategory,
} from "../../../interface/IgoodsCategory";
import { notifications } from "@mantine/notifications";

export default function GoodGategory() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [   GategoryFormStatus,
    { open: openedGategoryFormStatus, close: closeGategoryFormStatus },
  ] = useDisclosure(false);
  const [tableData, setTableData] = useState<ApiDataGoodsCategory[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const handleCreateNewRow = (values: ApiDataGoodsCategory) => {
    tableData.push(values);
    setTableData([...tableData]);
  };


  const [visible, setVisible] = useState(false);
  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };
  // 定义表单标题
  const [formTitle, setFormTitle] = useState("");
  // 定义返回商品类型返回数据
  const [goodsCategoryData, SetGoodsCateToryData] = useState<
    ApiDataGoodsCategory[]
  >([]);
  // 定义返回商品类型单条数据
  const [goodsCategoryItemData, SetGoodsCateToryItemData] =
    useState<ApiDataGoodsCategory>({
      id: "",
      type: "",
      category_name: "",
      category_desc: "",
      order: 0,
    });

  // 打开添加类型模态框
  const openCategoryBox = (value: string) => {
    if (value == "create")
      SetGoodsCateToryItemData({
        id: "",
        type: "",
        category_name: "",
        category_desc: "",
        order: 0,
      });
    setFormTitle("新建商品类型");
    openedGategoryFormStatus();
  };

  // 初始化商品类型列表
  const ajaxGetData = async () => {
    console.log(123);
    const goodsCategoryDataResponese = await apiGoodsCategory({}, "GET");
    console.log(goodsCategoryDataResponese.data.data);
    SetGoodsCateToryData(goodsCategoryDataResponese.data.data);
  };

  useEffect(() => {
    ajaxGetData();
  }, []);

  const handleDeleteRow =(row: ApiDataGoodsCategory) => {
    console.log(row.id)
        modals.openConfirmModal({
          title: "Delete your profile",
          centered: true,
          children: (
            <Text size="sm">
              Are you sure you want to delete your profile? This action is
              destructive and you will have to contact support to restore your data.
            </Text>
          ),
          labels: { confirm: "Delete account", cancel: "No don't delete it" },
          confirmProps: { color: "red" },
          onCancel: async () => {
            const goodsCategoryDataResponese = await apiGoodsCategory({id:row.id}, "DELETE");

        }, onConfirm: async () => {
            setVisible(true);
           const goodsCategoryDataResponese = await apiGoodsCategory({id:row.id}, "DELETE");
           setVisible(false);
           const result = goodsCategoryDataResponese.data;
            if (result.code === 200) {
              ajaxGetData();
              notifications.show({
                title: "Hint",
                color: "green",
                icon: <IconCheck />,
                message: result.msg,
              });
            } else {
              notifications.show({
                title: "Login Error",
                color: "red",
                icon: <IconX />,
                message: result.msg,
              });
          }
         }
        })
    
    }


  const getCommonEditTextInputProps = useCallback(
    (
      cell: MRT_Cell<ApiDataGoodsCategory>
    ): MRT_ColumnDef<ApiDataGoodsCategory>["mantineEditTextInputProps"] => {
      return {
        error: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "age"
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo<MRT_ColumnDef<ApiDataGoodsCategory>[]>(
    () => [
      {
        accessorKey: "id",
        header: "编号",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 50, //small column
      },
      {
        accessorKey: "category_name",
        header: "商品名称",
        size: 50, //small column
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: "type",
        header: "类型",
        size: 50, //small column
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },

      {
        accessorKey: "category_desc",
        header: "描述",
        size: 50, //small column
        Cell: ({ renderedCellValue }) => {
          let truncatedValue = "";
          if (typeof renderedCellValue === "string") {
            truncatedValue =
              renderedCellValue.length > 23
                ? `${renderedCellValue.substring(0, 30)}...`
                : renderedCellValue;
          } else if (typeof renderedCellValue === "number") {
            truncatedValue = String(renderedCellValue);
          }
          if (truncatedValue) {
            return (
              <strong dangerouslySetInnerHTML={{ __html: truncatedValue }} />
            );
          }
          return null;
        },
      },
    ],
    [getCommonEditTextInputProps]
  );
  // 定义打开编辑
  const editData = useCallback(
    (row: MRT_Row<ApiDataGoodsCategory>) => {
      SetGoodsCateToryItemData(row.original);
      setFormTitle("编辑商品类型(ID:" + row.original.id + ")");
      openedGategoryFormStatus();
    },
    [tableData]
  );
  const handlerFrom = (value: any) => {
    if (value) ajaxGetData();
    closeGategoryFormStatus();
  };
  return (
    <Box p={20} w="100%">
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <MantineReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            mantineTableHeadCellProps: {
              align: "left",
              sx: {
                tableLayout: "fixed",
              },
            },
          },
        }}
        initialState={{
          columnOrder: [
            "id",
            "category_name",
            "type",
            "category_desc",
            "mrt-row-actions",
          ],
          density: "xs",
        }}
        columns={columns}
        data={goodsCategoryData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        renderRowActions={({ cell, row, table }) => (
          <Box sx={{ display: "flex", gap: "16px" }}>
            <Tooltip withArrow position="left" label="Edit">
              <ActionIcon onClick={() => editData(row)}>
                <IconEdit size="1.2rem" slope={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip withArrow position="right" label="Delete">
              <ActionIcon color="red" onClick={() =>handleDeleteRow(row.original)}>
                <IconTrash size="1.2rem" slope={1.5} />
              </ActionIcon>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="dark.4"
            onClick={() => openCategoryBox("create")}
            variant="filled"
          >
            新建商品类型
          </Button>
        )}
      />
      <Modal
        size="xl"
        opened={GategoryFormStatus}
        onClose={closeGategoryFormStatus}
        title={<Text fw={700}>{formTitle}</Text>}
      >
        <CateGoryFrom
          callback={handlerFrom}
          goodsCategoryItemData={goodsCategoryItemData}
        />
      </Modal>
    </Box>
  );
}

interface Props {
  columns: MRT_ColumnDef<ApiDataGoodsCategory>[];
  onClose: () => void;
  onSubmit: (values: ApiDataGoodsCategory) => void;
  open: boolean;
}

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age: number) => age >= 18 && age <= 50;
