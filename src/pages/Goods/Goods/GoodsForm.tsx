import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  Group,
  NumberInput,
  Radio,
  rem,
  Select,
  Table,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconCircle1Filled,
  IconCircle2Filled,
  IconCircle3Filled,
} from "@tabler/icons-react";
import { SelectPullDown } from "../../../interface/Icommon";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import UploadSingleImage from "../../Common/UploadSingleImage";
import { useState } from "react";
import RichTextEditor from "../../Common/RichTextEditor";
import SystemData from "../../../utils/SystemData";
import { apiGoodsTypeAttribute } from "../../../api";
import { Attribute } from "../../../interface/Ispecification";
interface GoodsFormProps {
  goodsCategory: SelectPullDown[];
  goodsTypeSelect: SelectPullDown[];
  callback: () => void;
}
export default function GoodsForm({ goodsCategory, goodsTypeSelect }: GoodsFormProps) {


  const [valueCheck, setCheckValue] = useState<string[]>([]);
  const [SelectAttr, SetSelectAttr] = useState<any>();
  const [SelectAttrData, SetSelectAttrData] = useState<any>();
  const [atrrStatusInput, SetatrrStatusInput] = useState<boolean>(false);
  // 设置选择的类型
  const [goodType, setGoodType] = useState<string | null>("");
  // 设置选择的类型
  const [Attribute, setAttribute] = useState<Attribute[]>([]);
  const [value, setValue] = useState("1");
  const form = useForm({
    initialValues: { name: "", email: "", age: 0 },
    // functions will be used to validate values at corresponding key
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      age: (value) =>
        value < 18 ? "You must be at least 18 to register" : null,
    },
  });

  const setSelectGoodTypeCheckValue = (attr_ids: string[]) => {
    setCheckValue(attr_ids);
    const arr = Attribute.filter((parent) => {
      return parent.attr.some((value) => attr_ids.includes(value.id.toString()));
    }).map((parent) => {
      return {
        id: parent.id,
        attr_name: parent.attr_name,
        attr: parent.attr.filter((value) => attr_ids.includes(value.id.toString())),
      };
    });
    SetatrrStatusInput(arr.length == Attribute.length);
    if (arr.length == Attribute.length) {
      const result: any[] = [];

      const generateCombinations = (index: number, current: {}) => {
        if (index === arr.length) {
          result.push(current);
          return;
        }

        const currentAttr = arr[index].attr;
        const currentKey = arr[index].attr_name;
        for (const item of currentAttr) {
          const newCurrent = { ...current, [currentKey]: item };
          generateCombinations(index + 1, newCurrent);
        }
      };

      generateCombinations(0, {});
      const transformedArr = result.map((obj) => Object.values(obj));
      SetSelectAttrData(transformedArr)
    }
    SetSelectAttr(arr)
    console.log(arr);
  };

  const SelectGoodType = async (good_type_id: string | null) => {
    SetSelectAttrData([]);
    setCheckValue([])
    console.log(good_type_id)
    const GoodsTypeAttributeResponese = await apiGoodsTypeAttribute({ id: good_type_id }, "GET");
    if (GoodsTypeAttributeResponese.data.code == 200) {
      setAttribute(GoodsTypeAttributeResponese.data.data)
    }

  }
  const [imagePath, setImagePath] = useState("");
  const handleValueChange = (value: string) => {
    console.log(value);
    form.setFieldValue("companyLogoPath", value);
    // setImagePath(value)
  };
  function RichTextEditorCallBack(value: string): void {
    console.log(value);
  }
  console.log(SelectAttr, 22)
  return (
    <form onSubmit={form.onSubmit(console.log)}>
      <Grid columns={20} gutter={0}>
        <Grid.Col span={7} mx={20}>
          <Divider
            variant="dashed"
            labelPosition="center"
            label={
              <>
                <IconCircle1Filled size={17} />
                <Box ml={5}>填写商品基本信息</Box>
              </>
            }
          />

          <Grid>
            <Grid.Col span={7}>  <TextInput
              label="商品名称"
              placeholder="商品名称"
              {...form.getInputProps("goods_name")}
            />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={7}><Select
              label="商品类型"
              placeholder="选择一种商品类型"
              searchable
              {...form.getInputProps("goods_category_id")}
              nothingFound="No options"
              data={goodsCategory}
            />
            </Grid.Col>
          </Grid>



          <Textarea
            label="商品关键字"
            placeholder="商品关键字"
            description="多个关键字用逗号分割"
            autosize
            {...form.getInputProps("keywords")}
            minRows={2}
            maxRows={4}
          />

          <Textarea
            label="商品简介，促销语"
            autosize
            minRows={2}
            {...form.getInputProps("introduction")}
            maxRows={4}
          />
          <Grid columns={12}>
            <Grid.Col span={6}>
              <NumberInput
                mt="sm"
                label="可使用积分"
                description="0为不可以使用积分"
                placeholder="可使用积分"
                min={0}
                max={99}
                {...form.getInputProps("point_exchange")}
              />

            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                mt="sm"
                label="赠送积分"
                description="购买该商品赠送积分"
                placeholder="赠送积分"
                {...form.getInputProps("give_point")}
                min={0}
                max={99}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="运费"
                placeholder="运费"
                {...form.getInputProps("freight_fee")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Select
                label="运费模板"
                placeholder="选择一种运费"
                searchable
                {...form.getInputProps("freight_fee_id")}
                nothingFound="No options"
                data={SystemData.ShippingTemplate}
                {...form.getInputProps("role_id")}
              />
            </Grid.Col>


            <Grid.Col span={6}>  <NumberInput
              label="库存"
              min={0}
              max={99}
              {...form.getInputProps("age")}
            />
            </Grid.Col>

            <Grid.Col span={6}> <TextInput
              label="价格"
              placeholder="价格"
              {...form.getInputProps("name")}
            />
            </Grid.Col>

            <Grid.Col span={6}>    <TextInput
              label="商家编码"
              description="商品或产品进行的内部编码"
              {...form.getInputProps("name")}
            />
            </Grid.Col>
            <Grid.Col span={6}>   <NumberInput
              label="是否限购"
              description="0不限购，其他数字为限购件数"
              {...form.getInputProps("max_buy")}
            />
            </Grid.Col>
            <Grid.Col span={6}>
            </Grid.Col>
          </Grid>

          <Grid>

          </Grid>

          <Group>




          </Group>
          <Text mt={10}>上传主图</Text>
          <UploadSingleImage
            onImageValueCallback={handleValueChange}
            imagePath={imagePath}
            w={300}
            h={200}
            wImage={285}
            hImage={180}
          />
        </Grid.Col>
        <Grid.Col span="auto">
          <Divider
            variant="dashed"
            labelPosition="center"
            label={
              <>
                <IconCircle2Filled size={17} />
                <Box ml={5}>填写商品规格属性信息</Box>
              </>
            }
          />

          <Grid>
            <Grid.Col span={4}>   <Select
              label="规格类型"
              placeholder="选择一种规格类型"
              searchable
              onChange={SelectGoodType}
              nothingFound="No options"
              data={goodsTypeSelect}
            />
            </Grid.Col>

          </Grid>
          {Attribute.length > 0 ?
            <Card withBorder mt={5} shadow='md' >
              <Checkbox.Group
                mb={20}
                value={valueCheck}
                onChange={setSelectGoodTypeCheckValue}
                withAsterisk
              >
                {Attribute?.map((item, index) => {
                  return (
                    <>
                      <Box mt={2}>
                        {item.attr_name}
                      </Box>
                      <Group mt={2}>
                        {item.attr.map((attrItme, attrIndex) => (
                          <Checkbox value={attrItme.id.toString()} label={attrItme.attr_value} />
                        ))}   </Group>
                    </>
                  )
                })}
              </Checkbox.Group>

              {atrrStatusInput ? <Table  horizontalSpacing="md" verticalSpacing="xs" striped highlightOnHover  withColumnBorders>
                <tr className="pb-10" >
                  <td className="pb-10">批量填充</td>
                  <td className="pb-10"> <NumberInput
                        placeholder='数量'
                    /></td>


                    <td className="pb-10"> <TextInput
                        placeholder='单价'
                    /></td>

                    <td className="pb-10">
                      <TextInput
                        placeholder='商品编码'
                      /></td>
                          <td className="pb-10">
                            <Button>确定</Button>
                     </td>
                </tr>
                <tr className="text-center">
                  {/* 循环表头 */}
                  {SelectAttr.map((item: any, index: number) => (
                    <>
                      <th>{item.attr_name}</th>
                    </>
                  ))}
                  <th>数量</th>
                  <th>单价</th>
                  <th>商品编码</th>
                </tr>

                {SelectAttrData.map((item: any[], index: any) => {
                  return (<tr className="text-center">
                    {item.map((itemSub: any, indexSub: any) => {
                      return (
                        <td>{itemSub.attr_value}</td>
                      )
                    })}
                    <td> <NumberInput
                      defaultValue={0}
                    /></td>


                    <td> <TextInput
                      defaultValue='00.00'
                    /></td>

                    <td>
                      <TextInput
                      />
                    </td>
                  </tr>)
                })}



              </Table> : null}

            </Card >
            : null}



          <Divider
            variant="dashed"
            labelPosition="center"
            label={
              <>
                <IconCircle3Filled size={17} />
                <Box ml={5}>填写商品其他信息</Box>
              </>
            }
          />

          <RichTextEditor content="" callBack={RichTextEditorCallBack} />
          <Radio.Group
            value={value}
            onChange={setValue}
            name="favoriteFramework"
            label="是否上架"
            withAsterisk
          >
            <Group>
              <Radio value="1" label="立刻上架" />
              <Radio value="2" label="仓库" />
            </Group>
          </Radio.Group>
          <Button type="submit" mt="sm">
            保存
          </Button>
        </Grid.Col>
      </Grid>
    </form>
  );
}
