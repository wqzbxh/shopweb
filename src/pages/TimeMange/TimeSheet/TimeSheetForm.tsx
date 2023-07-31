import { ActionIcon, Box, Button, Code, Grid, Group, NumberInput, Select, Text, Textarea, TextInput } from "@mantine/core";
import { DateInput, DateTimePicker, TimeInput } from "@mantine/dates";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconClock, IconX } from "@tabler/icons-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { apiTimeTracker, apiTimeTrackerAction } from "../../../api";
import { SelectPullDown } from "../../../interface/Icommon";
import { EventData } from "../../../interface/ItimeTracker";
import { ClientWarningHint, DaleteData, formatDate, HintInfo } from "../../../utils/function";
import RichTextEditor from "../../Common/RichTextEditor";
import { calculateTime, calculateTimeInterval, TimeHHSS } from "../../../utils/Time";


interface ITimeSheet {
    Data: EventData;
    timeProjectSelect: SelectPullDown[];
    callback: (value: any) => void;
  }


export default function TimeSheetForm({callback,Data,timeProjectSelect}:ITimeSheet) {
    

    const [updateTime, setUpdateTime] = useState(false);
    //定义加载器
    const [visible, setVisible] = useState(false);
    const [projectid,setProject] = useState<number>(0)
    const ref = useRef<HTMLInputElement>();
    const form = useForm({
        initialValues: {
          id:Data.id,
          title:Data.title.split('@')[1],
          time_mark:Data.time_mark,
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
        const formattedDate = formatDate(new Date(form.values.start_time), "YYYY-MM-DD HH:mm:ss");
        const formatendDate = formatDate(new Date(form.values.end_time), "YYYY-MM-DD HH:mm:ss");
        const  originData = {
          id:form.values.id,
          time_mark:form.values.time_mark,
          start_time: formattedDate,
          title:form.values.title,
          time_project_id:form.values.time_project_id,
          end_time:formatendDate,
          time:form.values.time,
        }
        let response;
        const method = form.values.id !='' ? "PUT" : "POST";
        
        setVisible(true);
        response = await apiTimeTrackerAction(originData, method);
        setVisible(false);
        const result = response.data;
        if(HintInfo(result)) callback(true);
      };
        console.log(Data.time_project_id)
      function RichTextEditorCallBack(value: string): void {
        console.log(value);
        
        form.setFieldValue('time_mark', value);
      }
      useEffect(() => {
        setProject(projectid+1)
    }, [Data.time_project_id,timeProjectSelect]);

    useEffect(() => {
      const timeDiff = calculateTimeInterval(form.values.start_time, form.values.end_time);
      console.log(timeDiff, 55);
  
      // 检查时间间隔是否有更新，只有当时间间隔值发生变化时才更新 form 的值
      if (form.values.time !== timeDiff) {
        form.setFieldValue('time', timeDiff);
      }
    }, [form.values.start_time, form.values.end_time]);


    const handleDeleteRow = (id: string) => {
      const Info = <Text size='md' color='dark'>删除ID:{id}此条记录</Text>;
      DaleteData(Info, async () => {    // 调用异步请求的逻辑
        const response = await apiTimeTrackerAction({id:id}, "DELETE");
        const result = response.data; // 返回请求结果
        if(HintInfo(result))callback(true);;
      });
    };
      return (
        <Box component="form" mx="auto" mih={450} onSubmit={handleFormSubmit}>
             <Grid>
            <Grid.Col span={4}>
            <Select
              label="选择项目"
              searchable
              data={timeProjectSelect}
              nothingFound="No options"
              key={form.values.time_project_id}
              onChange={(value) => form.setFieldValue('time_project_id', value as string)}
              defaultValue={form.values.time_project_id.toString()}
            
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
                <TextInput
                label="时间花销" description='输入后，结束时间则为当前时间'  placeholder="输入……"
                 disabled
                value={form.values.time}
                onChange={(event) => form.setFieldValue('time', event.target.value)}
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
              
             <Grid>
            <Grid.Col span={4}>
                  <Textarea
                  label="任务信息"
                  autosize
                  minRows={2}
                  {...form.getInputProps("title")}
                  maxRows={4}
                />
                  </Grid.Col>
          
             </Grid> 
              
          <RichTextEditor title='附属信息（选填）' content={form.values.time_mark} callBack={RichTextEditorCallBack} />
  
          <Group position="right" mt={30}>
              {form.values.id !='' ?  <Button onClick={() =>handleDeleteRow(form.values.id )} color='red'>删除</Button> : null}
              <Button type="submit">保存</Button> 
          </Group>
        </Box>
      );
}