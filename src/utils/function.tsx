import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { data } from "../pages/Goods/Category/makeData";

// 删除提示
export const DaleteData = async (info: React.ReactNode, request: () => Promise<any>) => {
  modals.openConfirmModal({
    title: <Text size='md' color='dark'>即将删除的信息：</Text>,
    centered: true,
    children: info,
    labels: { confirm: "删除", cancel: "取消" },
    confirmProps: { color: "red" },
    onCancel: async () => {},
    onConfirm:  () => {
          request();
    },
  });
};

// 请求成功/失败 提示
export const HintInfo=(result: { code: number; msg: any; })=>{
  if (result.code === 200) {
    notifications.show({
      title: "成功",
      color: "green",
      icon: <IconCheck />,
      message: result.msg,
    });
  
    }else {
    notifications.show({
      title: "Login Error",
      color: "red",
      icon: <IconX />,
      message: result.msg,
    });
    return false;
    }
    return true;
}


// 
