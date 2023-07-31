import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconAlertSquareRounded, IconCheck, IconX } from "@tabler/icons-react";
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
      title: "来自服务器的错误提示",
      color: "red",
      icon: <IconX />,
      message: result.msg,
    });
    return false;
    }
    return true;
}


// 请求成功/失败 提示
export const HintInfoClien=(result: { color: string; msg: any; })=>{
    notifications.show({
      color: result.color,
      icon: <IconAlertSquareRounded />,
      message: result.msg,
    });
}

// 客户端警告  客户端警告
export const ClientWarningHint =(errors:any)=>{
  notifications.show({
    title: "客户端警告",
    color: "yellow.7",
    icon: <IconX />,
    message: Object.values(errors)[0] as React.ReactNode,
  });
}


/**
 * 
 */
// 将日期字符串转换为指定格式的日期字符串（包括秒数）
export function formatDate(date: Date, format?: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  let formattedDate = format
    ? format.replace("YYYY", String(year))
            .replace("MM", month)
            .replace("DD", day)
            .replace("HH", hours)
            .replace("mm", minutes)
            .replace("ss", seconds)
    : `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  if (format && formattedDate.endsWith(":00")) {
    formattedDate = formattedDate.substring(0, formattedDate.length - 3);
  }

  return formattedDate;
}

