import { useForm } from '@mantine/form';
import { Box, TextInput, NumberInput, Button, Group, Textarea, Text, LoadingOverlay, Code, useMantineColorScheme } from '@mantine/core';
import { IndeterminateCheckbox } from './RoleSelect';
import { Irole, MenuItem } from '../../../interface/Irole';
import { FormEvent, useState } from 'react';
import { IconCheck, IconPlus, IconSquarePlus, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { apiGoodsCategory, apiUserRole } from '../../../api';

interface IMenuItemProps{
    MenuItem:MenuItem[];
    menuIdArr:string[];
    roleItem:Irole;
    callback:(value:any)=>void
}
export  function RoleForm({callback,roleItem,MenuItem,menuIdArr}:IMenuItemProps) {
  
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  //定义加载器
  console.log(roleItem,'22')
  const [visible, setVisible] = useState(false);
  const [menuId, setMenuId] = useState<string[]>(menuIdArr);
  const form = useForm<Irole>({
    initialValues:roleItem,
    validate: (values) => ({
      role_name: values.role_name.length < 2 ? 'Too short name' : null,
    }),
  });
  
  

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Stop the formal submission of the form default
    // Verification form
    const valid = await form.validate();
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
    const  method = form.values.id ? 'PUT' : 'POST';
    setVisible(true);
    response = await apiUserRole(form.values,method);
    setVisible(false);
    const result = response.data;
    if (result.code === 200) {
       callback(true)
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
  };
  function setMenuIdCallback(value:string[]){
    setMenuId(value)
    form.setFieldValue('menu_id',value)
  } 

  return (
    <Box>
    <LoadingOverlay visible={visible} overlayBlur={2} />
  
      <form onSubmit={handleFormSubmit}>
        <TextInput label="角色名称"
        w={200}
        placeholder="最少两位" {...form.getInputProps('role_name')} />

      <Textarea
        placeholder="角色职责描述"
        label="描述"
        w={300}
        mt={5}
        autosize
        {...form.getInputProps('desc')}
        minRows={3}
      />
    
       <Text fw={400} size='0.9rem' mt={5}>
        菜单选择
      </Text>
        <IndeterminateCheckbox callback={setMenuIdCallback} menuId={menuId} items={MenuItem} />
        <Group position="right" mt="md">
          <Button 
          color={dark?'blue':'dark'}
          variant="outline" leftIcon={<IconPlus/>}   type="submit">保存</Button>
        </Group>
      </form>
    </Box>
  );
}