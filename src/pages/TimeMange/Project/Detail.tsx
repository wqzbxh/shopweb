import { Box, Card, Center, Grid, Group, List, Progress, RingProgress, Select, Text, ThemeIcon } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { Icon123, IconCircleCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { apiTimeTrackerAction } from "../../../api";
import { SelectPullDown } from "../../../interface/Icommon";
import { IProject } from "../../../interface/ItimeProject";
import { formatDate } from "../../../utils/function";
import {  } from '@mantine/dates'; // 导入俄语本地化对象
import { Data } from "../../../interface/ItimeTracker";


interface IProjectForm {
    projectItem: IProject;
    userList: SelectPullDown[];
    callback: (value: any) => void;
  }

export default function Detail({projectItem,userList}:IProjectForm){
    const [timeValue, setTimeValue] = useState<[Date | null, Date | null]>([null, null]);
    const [userValue, setUserValue] = useState<string | null>(null);
      
    const [TimeTracker,setTimeTracker] = useState<Data>()
    const  ajaxInit = async()=>{
    console.log(projectItem.id,44)
    const start_time = formatDate(new Date(timeValue[0] as Date), "YYYY-MM-DD HH:mm:ss");
    const end_time = formatDate(new Date(timeValue[1] as Date), "YYYY-MM-DD HH:mm:ss");
 
    const timeTrackOption =  await apiTimeTrackerAction({type:'project_user',user_id:userValue,start_time:start_time,end_time:end_time,time_project_id:projectItem.id});
    if(timeTrackOption.data.code === 200){  
      setTimeTracker(timeTrackOption.data.data )
    }
}
useEffect(()=>{
    ajaxInit();
},[timeValue,userValue])      
console.log(timeValue,232)
    return (
        <Grid columns={20} gutter={30}>
            <Grid.Col span={8}>
              <Select
                label="选择用户"
                description={`选择一个用户,看Ta 在  ${projectItem.name}  的花销时间 `}
                searchable
                onChange={setUserValue}
                nothingFound="No options"
                data={userList}
                />
                <Group position="left">
                <DatePicker type="range" value={timeValue} onChange={setTimeValue} />
                </Group>
            </Grid.Col>
             <Grid.Col span={12}>

             <Card
                withBorder
                radius="md"
                padding="xl"
                sx={(theme) => ({
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                })}
                >
                <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                      {formatDate(new Date(timeValue[0] as Date), "YYYY-MM-DD HH:mm:ss")} - {formatDate(new Date(timeValue[1] as Date), "YYYY-MM-DD HH:mm:ss")} 
                   <Text>
                         总共计时:
                   </Text>
                </Text>
                <Text fz="lg" fw={500} c='red'>
                     <strong>{TimeTracker?.total_time}</strong>
                </Text>
                   {/* <Progress value={54.31} mt="md" size="lg" radius="xl" /> */}
                </Card>
            <List 
            mt={10}
            spacing="xs"
            size="sm"
            center
            icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconCircleCheck size="1rem" />
                </ThemeIcon>
            }
            >
                {TimeTracker?.rows.map((item,index)=>(
                    <>
                        <List.Item> <strong>【{item.time}】</strong>   ({formatDate(new Date(item.start_time), "YYYY-MM-DD HH:mm")}- {formatDate(new Date(item.end_time), "YYYY-MM-DD HH:mm")}) {item.title}</List.Item>
                    </>
                ))}
            </List>
             </Grid.Col>
            
           
        </Grid>
    )
}