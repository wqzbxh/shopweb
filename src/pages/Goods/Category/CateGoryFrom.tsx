import { useForm } from "@mantine/form";
import {
  NumberInput,
  TextInput,
  Button,
  Box,
  Text,
  Code,
  LoadingOverlay,
} from "@mantine/core";
import RichTextEditor from "../../Common/RichTextEditor";
import { Icon123, IconCategory, IconCheck, IconX } from "@tabler/icons-react";
import { apiGoodsCategory } from "../../../api";
import { FormEvent, useState } from "react";
import { ApiDataGoodsCategory } from "../../../interface/IgoodsCategory";
import { notifications } from "@mantine/notifications";


interface CateGoryFromProps {
  goodsCategoryItemData: ApiDataGoodsCategory;
  callback:(Value:any)=>void
}
export default function CateGoryFrom({
  goodsCategoryItemData,
  callback
}: CateGoryFromProps) {
  const [visible, setVisible] = useState(false);
  const form = useForm({
    initialValues: {
      id:goodsCategoryItemData.id,
      category_name: goodsCategoryItemData.category_name,
      order: goodsCategoryItemData.order,
      category_desc: goodsCategoryItemData.category_desc,
      type: "normal",
    },

    // functions will be used to validate values at corresponding key
    validate: {
      category_name: (value) =>
        value.length < 2 ? "商品类型必须两个字以上" : null,
      order: (value) => (value > 20 ? "排序值不能超过20" : null),
    },
  });
  const RichTextEditorCallBack = (value: string) => {
    form.setFieldValue("category_desc", value);
  };

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
    response = await apiGoodsCategory(form.values,method);
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

  return (
    <Box>
      <form onSubmit={handleFormSubmit}>
        <LoadingOverlay visible={visible} overlayBlur={2} />
        <TextInput
          icon={<IconCategory />}
          label="商品类型名称"
          w={300}
          placeholder="类型名称……"
          {...form.getInputProps("category_name")}
        />
        <NumberInput
          mt="sm"
          icon={<Icon123 />}
          label="排序"
          placeholder="数字"
          w={100}
          min={0}
          max={20}
          {...form.getInputProps("order")}
        />
        <RichTextEditor
          content={goodsCategoryItemData.category_desc}
          callBack={RichTextEditorCallBack}
        />
        <Button type="submit" color="dark.4" variant={"outline"} mt="sm">
          保存
        </Button>
      </form>
      {/* <Text size="sm" weight={500} mt="xl">
        Form values:
      </Text>
      <Code block mt={5}>
        {JSON.stringify(form.values, null, 2)}
      </Code> */}
    </Box>
  );
}
