import { useForm } from "@mantine/form";
import {
  Box,
  TextInput,
  NumberInput,
  Button,
  Group,
  Textarea,
  Text,
  LoadingOverlay,
  Code,
  useMantineColorScheme,
  Grid,
  Flex,
  Select,
  PasswordInput,
} from "@mantine/core";
import { Irole, MenuItem } from "../../../interface/Irole";
import { FormEvent, useState } from "react";
import { IconCheck, IconLock, IconLockCheck, IconPlus, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { apiUser, apiUserRole } from "../../../api";
import { Iuser } from "../../../interface/Iuser";
import { SelectPullDown } from "../../../interface/Icommon";
import { useDisclosure } from "@mantine/hooks";
import { HintInfo } from "../../../utils/function";

interface IMenuItemProps {
  infoItem: Iuser;
  RoleSelect: SelectPullDown[];
  callback: (value: any) => void;
}
export default function UserForm({
  callback,
  RoleSelect,
  infoItem,
}: IMenuItemProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  //定义加载器
  const [visible, setVisible] = useState(false);
  const form = useForm<Iuser>({
    initialValues: {...infoItem},
    validate: {
      name: (value) => (value.length < 2 ? '至少两个字符以上' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : '邮箱不合法'),
      password: (value) => {
        if (!/^[A-Za-z0-9_@.]{6,18}$/.test(value as string)) {
          return '密码长度应为6-18位，只能包含字母、数字、下划线、@和点号字符';
        }
        return null;
      },
      confirm_password: (value, values) =>
      value !== values.password ? '密码不一致' : null,
    },
  });

  // 定义角色
  const [RoleId, SetRoleId] = useState(infoItem.role_id);
  // 定义用户状态
  const [status, SetStatus] = useState(infoItem.status);
// 密码可见
  const [visiblePassword, { toggle }] = useDisclosure(false);
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Stop the formal submission of the form default
    // Verification form
    const valid = await form.validate();
    if(form.values.password !==form.values.confirm_password)
    {
      notifications.show({
        title: "警告",
        color: "yellow.7",
        icon: <IconX />,
        message: '两次密码不一致',
      });
      return;
    }
    if (valid.hasErrors) {
      notifications.show({
        title: "警告",
        color: "yellow.7",
        icon: <IconX />,
        message: Object.values(valid.errors)[0],
      });
      return;
    }
    let response;
    const method = form.values.id ? "PUT" : "POST";
    setVisible(true);
    response = await apiUser(form.values, method);
    setVisible(false);
    const result = response.data;
    if(HintInfo(result)) callback(true);
  };
  function setMenuIdCallback(value: string[]) {
    form.setFieldValue("menu_id", value);
  }

  return (
    <Box>
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <form onSubmit={handleFormSubmit}>
        <Flex gap="md">
          <Box>
            <TextInput
              label={
                <Flex>
                  <Text size="0.875rem">邮箱</Text>
                  <Text m={0} size="0.675rem">
                    （登录账号-必填）
                  </Text>
                </Flex>
              }
              w={200}
              placeholder="example@example.com"
              {...form.getInputProps("email")}
            />
          </Box>
        </Flex>

        <Flex gap="md" mt={15}>
          <Box>
            <TextInput
              label="名字"
              required
              w={300}
              placeholder="选一个名字更容易记住你"
              {...form.getInputProps("name")}
            />
          </Box>
          <Box>
            <TextInput
              label="手机号"
              w={200}
              placeholder="输入……"
              {...form.getInputProps("phone")}
            />
          </Box>
        </Flex>

        <Flex gap="md" mt={15}>
          <Box>
            <TextInput
              label="真实名字"
              required
              w={200}
              placeholder="真实名字"
              {...form.getInputProps("realname")}
            />
          </Box>
          <Box>
            <TextInput
              label={
                <Flex>
                  <Text size="0.875rem">身份证ID</Text>
                  <Text m={0} size="0.675rem">
                    （选填）
                  </Text>
                </Flex>
              }
              w={300}
              placeholder="身份证ID"
              {...form.getInputProps("idcard")}
            />
          </Box>
        </Flex>
        <Flex gap="md" mt={15}>
          <Box>
            <Select
              label="角色类型选择"
              placeholder="选择一种"
              searchable
              onSearchChange={SetRoleId}
              searchValue={RoleId}
              nothingFound="No options"
              data={RoleSelect}
              {...form.getInputProps("role_id")}
            />
          </Box>{" "}
          <Box>
            <Select
              label="状态"
              placeholder="选择一种状态"
              searchable
              onSearchChange={SetStatus}
              searchValue={status}
              defaultValue={status}
              nothingFound="No options"
              data={[
                { value: "1", label: "正常" },
                { value: "2", label: "失效" },
              ]}
              {...form.getInputProps("status")}
            />
          </Box>
        </Flex>
      <Flex gap="md" mt={15}>
          <Box>
         
            <PasswordInput
              label={
                <Flex>
                  <Text size="0.875rem">密码</Text>
                  <Text m={0} size="0.675rem">
                 （格式字母数字下划线构成） 
                  </Text>
                  {infoItem.id ? <Text size="0.675rem" >当您不输入密码时,保持原始不变</Text> : null }
              
                </Flex>
              }
              defaultValue=""
              icon={<IconLock size="1rem" />}
              visible={visiblePassword}
              onVisibilityChange={toggle}
              w={400}
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label="确认密码"
              defaultValue=""
              icon={<IconLockCheck size="1rem" />}
              w={400}
              visible={visiblePassword}
              {...form.getInputProps("confirm_password")}
              onVisibilityChange={toggle}
            />
          </Box>
        </Flex>
        <Flex gap="md" mt={15}>
          <Box>
            <Button
              color={dark ? "blue" : "dark"}
              variant="outline"
              leftIcon={<IconPlus />}
              type="submit"
            >
              保存
            </Button>
          </Box>
        </Flex>
      </form>
    </Box>
  );
}
