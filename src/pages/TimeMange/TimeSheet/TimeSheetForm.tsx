import { ActionIcon, Box, Button, Code, Grid, Group, NumberInput, Select, Textarea, TextInput } from "@mantine/core";
import { DateInput, DateTimePicker, TimeInput } from "@mantine/dates";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconClock, IconX } from "@tabler/icons-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { apiTimeTracker } from "../../../api";
import { SelectPullDown } from "../../../interface/Icommon";
import { EventData } from "../../../interface/ItimeTracker";
import { ClientWarningHint, HintInfo } from "../../../utils/function";
import RichTextEditor from "../../Common/RichTextEditor";



interface ITimeSheet {
    Data: EventData;
    timeProjectSelect: SelectPullDown[];
    callback: (value: any) => void;
  }
export default function TimeSheetForm({callback,Data,timeProjectSelect}:ITimeSheet) {
    
    //定义加载器
    const [visible, setVisible] = useState(false);
    
    const ref = useRef<HTMLInputElement>();
    console.log(Data)
    const form = useForm({
        initialValues: {
          id:Data.id,
          time_mark:Data.title,
          start_time: Data.start,
          time_project_id:Data.time_project_id,
          end_time: Data.end,
          time:Data.time,
        },
        validate: {
        //   project_no: isNotEmpty('输入项目编号'),
          start_time: isNotEmpty('开始时间不能为空'),
          end_time: isNotEmpty('结束时间不能为空'),
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
        let response;
        const method = form.values.id ? "PUT" : "POST";
        setVisible(true);
        response = await apiTimeTracker(form.values, method);
        setVisible(false);
        const result = response.data;
        if(HintInfo(result)) callback(true);
      };
        console.log(Data.time_project_id)
      function RichTextEditorCallBack(value: string): void {
        console.log(value);
      }
      useEffect(() => {
        console.log(123)
        form.setFieldValue('time_project_id', Data.time_project_id);
    }, [Data]);

      return (
        <Box component="form" mx="auto" mih={450} onSubmit={handleFormSubmit}>
             <Grid>
             {/* <Code block mt={5}>
        {JSON.stringify(form.values, null, 2)}
      </Code> */}
            <Grid.Col span={4}>
            <Select
              label="选择项目"
              searchable
              data={timeProjectSelect}
              nothingFound="No options"
              key={form.values.time_project_id}
              onChange={(value) => form.setFieldValue('time_project_id', value as string)}
              defaultValue={form.values.time_project_id as string}
            
            />
            </Grid.Col>
            <Grid.Col span={4}>
               <DateTimePicker
                    valueFormat="YYYY-MM-DD HH:mm"
                    label="开始时间"
                    defaultValue={new Date()}
                    {...form.getInputProps('start_time')}
                    placeholder="开始时间"
                    mx="auto"
                 />
                 
            </Grid.Col>
                
             </Grid>
             <Grid>
            <Grid.Col span={4}>
                <TimeInput
                label="时间花销" description='输入后，结束时间则为当前时间'  placeholder="输入……"
                {...form.getInputProps('time')} 
                mx="auto"
              />
            </Grid.Col>
            
            <Grid.Col span={4}>
                <DateTimePicker
                    valueFormat="YYYY-MM-DD HH:mm"
                    label="结束时间"
                    description="输入后将自动计算时间花销"
                    defaultValue={new Date()}
                    {...form.getInputProps('end_time')}
                    placeholder="结束时间"
                    mx="auto"
                 />
            </Grid.Col>
             </Grid> 
                

          <RichTextEditor content="" callBack={RichTextEditorCallBack} />
  
          <Group position="right" mt={30}>
            <Button type="submit">保存</Button>
          </Group>
        </Box>
      );
}