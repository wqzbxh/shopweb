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
  Switch,
  useMantineTheme,
  Divider,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { Irole, MenuItem } from "../../../interface/Irole";
import { ChangeEvent, FormEvent, useState } from "react";
import { IconCheck, IconCirclePlus, IconLock, IconLockCheck, IconPlus, IconPlusEqual, IconPlusMinus, IconRowInsertTop, IconTrash, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { apiGoodsType, apiUser, apiUserRole } from "../../../api";
import { Iuser } from "../../../interface/Iuser";
import { SelectPullDown } from "../../../interface/Icommon";
import { randomId, useDisclosure } from "@mantine/hooks";
import { HintInfo } from "../../../utils/function";

interface IMenuItemProps {
  infoItem: Iuser;
  RoleSelect: SelectPullDown[];
  callback: (value: any) => void;
}
export default function SpecificationForm({
  callback,
  RoleSelect,
  infoItem,
}: IMenuItemProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === "dark";
  //定义加载器
  const [visible, setVisible] = useState(false);
  //   定义是否开启
    const [checked, setChecked] = useState(false);
    const [refresh, setRefresh] = useState(0);
    //   定义是否开启
    const [currentInput, setCurrentInput] = useState<{ value: string; index: number; }[]>([]);

  const form = useForm({
    initialValues: {id:'',name:'',sort:'',is_user:'',
    attributes: [{ sort:'',name: '', attribute:[], key: randomId() }]},
    validate: {
      name: (value) => (value.length < 2 ? '至少两个字符以上' : null)
  }
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
    form.setFieldValue('is_use',checked);
    setVisible(true);
    response = await apiGoodsType(form.values, method);
    setVisible(false);
    const result = response.data;
    if(HintInfo(result)) callback(true);
  };

  function setMenuIdCallback(value: string[]) {
    form.setFieldValue("menu_id", value);
  }

// 添加规格参数
  const addattribute =(index:number)=>{
         let  currentValue;
        console.log(currentInput[index])
        currentInput.map((item,indexs)=>{
            if(item){
                if(item.index == index ){
                    currentValue = item.value;
                    return;
                }
            }
        })
        if(currentValue){
            form.setFieldValue(`attributes.${index}.attribute`, [...form.values.attributes[index].attribute, currentValue]);
            setCurrentInput((prevInput) => {
                const updatedInput = prevInput.filter((item, i) => i !== index);
                return updatedInput;
              });
              setRefresh(refresh+1)
        }else{
            notifications.show({
                title: "警告",
                color: "yellow.7",
                icon: <IconX />,
                message: '请填写规格参数',
              });
        }
  }
// 删除具体的规格参数
  const delAttribute = (index: number, mindexAttribute: number) => {
    const updatedAttribute = [...form.values.attributes[index].attribute];
    updatedAttribute.splice(mindexAttribute, 1);
    form.setFieldValue(`attributes.${index}.attribute`, updatedAttribute);
    setRefresh(refresh + 1);
  };
//   将规格参数输入框的东西全部放到一个带有索引的池子当中
const handleInputChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target;
    if(value){
        setCurrentInput((prevInput) => {
            const updatedInput = [...prevInput];
            updatedInput[index] = { value, index };
            return updatedInput;
          });
    }
  };

  const deleteAttributes =(index:number)=>{
    if( form.values.attributes.length > 1 )
    {
        form.removeListItem('attributes', index)
    }
  }
  const fields = form.values.attributes.map((item, index) => (
    <Group key={item.key} mt="xs">
    <NumberInput
        required
        w={80}
        placeholder="排序"
        defaultValue={0}
        {...form.getInputProps(`attributes.${index}.sort`)}
    />
    <TextInput
      placeholder="规格名称"
      withAsterisk
      w={120}
      {...form.getInputProps(`attributes.${index}.name`)}
    />
    <TextInput
      withAsterisk
      w={120}
      placeholder={`规格参数`}
      key={refresh}
      onChange={(event) => handleInputChange(event, index)}
      
    />
    <ActionIcon    color={dark ? "blue" : "dark"} onClick={() => addattribute(index)}>
         <IconRowInsertTop size="1rem" />
    </ActionIcon>
    <Box>
            <Group>
        {item.attribute.length > 0 && item.attribute.map((itemAttribute,indexAttribute)=>{
            return (
            <Grid >
                <Badge color={dark ? "blue" : "dark"}  >{itemAttribute} </Badge> 
                  <ActionIcon color={dark ? "blue" : "dark"} onClick={() => delAttribute(index,indexAttribute)}>  <IconX  size={15} />  </ActionIcon>
            </Grid>
            )
        })} 
        </Group>
    </Box>
    <ActionIcon color="red" onClick={() => deleteAttributes(index)}>
    <IconTrash size="1rem" />
    </ActionIcon>
    </Group>
  ));


  return (
    <Box>
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <form onSubmit={handleFormSubmit}>
        <Flex gap="md">
          <Box>
            <TextInput
              label='类别名称'
              w={200}
              required
              placeholder="输入类别名称"
              {...form.getInputProps("name")}
            />
         
          </Box>
        </Flex>

        <Flex gap="md" mt={15}>
          <Box>
          <Group position="center">
            <Switch
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
                color="teal"
                label="是否启用"
                labelPosition="left"
                thumbIcon={
                checked ? (
                    <IconCheck size="0.8rem" color={theme.colors.teal[theme.fn.primaryShade()]} stroke={3} />
                ) : (
                    <IconX size="0.8rem" color={theme.colors.red[theme.fn.primaryShade()]} stroke={3} />
                )
                }
            />
            </Group>
          </Box>
        </Flex>

        <Flex gap="md" mt={15}>
          <Box>
            <NumberInput
              label="排序"
              required
              w={200}
              defaultValue={0}
              {...form.getInputProps("sort")}
            />
          </Box>
        </Flex>
        <Flex gap="md" mt={25}>
            <Box w='100%'>
                <Group>
            <Text>添加关联规格</Text>
            <ActionIcon color="red"  onClick={() => 
            form.insertListItem('attributes', { sort:'',name: '', attribute:[], key: randomId() })
          }  >
                <IconCirclePlus aria-label="sd" size="1rem" />
            </ActionIcon>
          </Group>
            <Divider mt={2}    color={dark ? "blue" : "dark"} size="xs" />
            </Box>
        </Flex>  
        <Flex gap="md" mt={25}>
            <Box w='100%'>
            {fields}  
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
