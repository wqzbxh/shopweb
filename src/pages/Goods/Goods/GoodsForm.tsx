import { Box, Button, Divider, Grid,Group, NumberInput, rem, Select, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCircle1Filled, IconCircle2Filled } from "@tabler/icons-react";
import { SelectPullDown } from "../../../interface/Icommon"
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import UploadSingleImage from "../../Common/UploadSingleImage";
import { useState } from "react";

interface GoodsFormProps{
    goodsCategory:SelectPullDown[];
    goodsType:SelectPullDown[];
    callback:()=>void
}
export default function GoodsForm({goodsCategory}:GoodsFormProps){
    const form = useForm({
        initialValues: { name: '', email: '', age: 0 },
    
        // functions will be used to validate values at corresponding key
        validate: {
          name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
          email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
          age: (value) => (value < 18 ? 'You must be at least 18 to register' : null),
        },
      });

      const [imagePath, setImagePath] = useState('');
      const handleValueChange = (value: string) => {
        console.log(value)
        form.setFieldValue('companyLogoPath', value);
        // setImagePath(value)
    };
    return(
        <form onSubmit={form.onSubmit(console.log)}>
        <Grid columns={20} gutter={0} >
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
                <TextInput
                    w={300} label="商品名称" placeholder="商品名称" {...form.getInputProps('name')} />
                <Select
                    label="商品类型"
                    placeholder="选择一种商品类型"
                    searchable
                    w={300}
                    nothingFound="No options"
                    data={['上','下']}
                    {...form.getInputProps("role_id")}
                    />
                    
               
                <Textarea
                label="商品关键字"
                placeholder="商品关键字"
                description='多个关键字用逗号分割'
                autosize
                w={400}
                minRows={2}
                maxRows={4}
            />   
               
            <Textarea
            label="商品简介，促销语"
            autosize
            minRows={2}
            w={400}
            maxRows={4}
        />
            <Group>
                <NumberInput
                mt="sm"
                label="可使用积分"
                description="0为不可以使用积分"
                placeholder="可使用积分"
                min={0}
                w={200} 
                max={99}
                {...form.getInputProps('age')}
                />
                <NumberInput
                mt="sm"
                label="赠送积分"
                description="购买该商品赠送积分"
                placeholder="赠送积分"
                min={0}
                w={200} 
                max={99}
                {...form.getInputProps('age')}
                />
                </Group>
                <TextInput
                    w={200} label="运费" placeholder="运费" {...form.getInputProps('name')} />
     <Group>
             <TextInput
                   w={200} label="价格" placeholder="价格" {...form.getInputProps('name')} />
                <NumberInput
                label="库存"
                w={100}
                min={0}
                max={99}
                {...form.getInputProps('age')}
                />
                <TextInput
                          w={200} label="商家编码" placeholder="商家编码" {...form.getInputProps('name')} />
                </Group>
                <Text mt={10}>上传主图</Text>
                <UploadSingleImage onImageValueCallback={handleValueChange} imagePath={imagePath} w={300} h={200} wImage={285} hImage={180} />

        </Grid.Col>
         <Grid.Col span='auto'>
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
              <Select
                    label="规格类型"
                    placeholder="选择一种规格类型"
                    searchable
                    w={300}
                    nothingFound="No options"
                    data={['上','下']}
                    {...form.getInputProps("role_id")}
                    />
                <Button type="submit" mt="sm">
                Submit
                </Button> 
          </Grid.Col>
        </Grid>
            </form>
    )
}