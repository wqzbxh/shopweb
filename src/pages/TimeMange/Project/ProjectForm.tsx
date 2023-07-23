import { Box, Button, Code, Grid, Group, NumberInput, Textarea, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { FormEvent, useState } from "react";
import { apiTimeTracker } from "../../../api";
import { ClientWarningHint, formatDate, HintInfo } from "../../../utils/function";



interface IProjectForm {
    // infoItem: Iuser;
    // RoleSelect: SelectPullDown[];
    callback: (value: any) => void;
  }
export default function ProjectForm({callback}:IProjectForm) {
    
    //定义加载器
    const [visible, setVisible] = useState(false);
    const form = useForm({
        initialValues: {
          id:"",
          info:'',
          name: '',
          project_no: '',
          start_date: new Date(),
          time_estimate:'00:00',
          customer_name: '',
        },
        validate: {
          name: hasLength({ min: 1, max: 45 }, '项目长度：1个字符到45个字符之间（文字1-15个）'),
        //   project_no: isNotEmpty('输入项目编号'),
          start_date: isNotEmpty('开始时间不能为空'),
          customer_name: isNotEmpty('项目客户不能为空'),
          info: isNotEmpty('描述必须存在，方便记录这各项目的方向'),
        },
      });
      const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Stop the formal submission of the form default
        // Verification form
        const valid = await form.validate();
        if (valid.hasErrors) {
          ClientWarningHint(valid.errors)
          return;
        }
        const formattedDate = formatDate(form.values.start_date, "YYYY-MM-DD");
        const  originData = {
          id:form.values.id,
          info:form.values.info,
          name: form.values.name,
          project_no: form.values.project_no,
          start_date: formattedDate,
          time_estimate:form.values.time_estimate,
          customer_name:form.values.customer_name,
        }
        let response;
        const method = form.values.id ? "PUT" : "POST";
        setVisible(true);
        response = await apiTimeTracker(originData, method);
        setVisible(false);
        const result = response.data;
        if(HintInfo(result)) callback(true);
      };


      return (
        <Box component="form" mx="auto" onSubmit={handleFormSubmit}>
            <Grid>
              <Grid.Col span={12}>
                 <TextInput label="项目名称" description='输入要记录时间的项目名称' placeholder="输入名称" withAsterisk {...form.getInputProps('name')} />
                 <TextInput   mt={10} label="项目编号" description='若不填写，系统将随机分配一个编号'  placeholder="输入项目编号" withAsterisk {...form.getInputProps('project_no')} />
                 <TextInput   mt={10} label="客户" description='项目的拥有者'  placeholder="输入客户" withAsterisk {...form.getInputProps('customer_name')} />
                 <TextInput   mt={10}  label="预计花费时间" description='估计项目需要花费多久，以小时为单位'  placeholder="输入……" withAsterisk {...form.getInputProps('time_estimate')} />
                 <Textarea
                    mt={10}
                    placeholder="输入……"
                    label="描述 "
                    withAsterisk
                    {...form.getInputProps('info')}
                />
                 <DateInput
                    valueFormat="YYYY-MM-DD"
                    label="开始时间"
                    defaultValue={new Date()}
                    {...form.getInputProps('start_date')}
                    placeholder="开始时间"
                    mx="auto"
                 />
                </Grid.Col>
            </Grid>
      
  
          <Group position="right" mt="md">
            <Button type="submit">保存</Button>
          </Group>
        </Box>
      );
}