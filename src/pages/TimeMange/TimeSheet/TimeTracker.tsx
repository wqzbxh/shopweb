import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Calendar, DateCellWrapperProps, momentLocalizer, SlotInfo } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/zh-cn'

import { Box, Button, Modal, Text, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import TimeSheetForm from './TimeSheetForm';
import { EventData } from '../../../interface/ItimeTracker';
import { CalendarProps } from '@mantine/dates';
import { getAllTimeTracker } from '../../../utils/AccessInformation';
import { SelectPullDown } from '../../../interface/Icommon';
moment.locale('zh-cn');
const localizer = momentLocalizer(moment);

const events = [
  {
    title: '喝茶',
    id: '4',
    time:"01:40",
    time_project_id:'74',
    start: new Date('2023-07-23 01:12:45'),
    end: new Date('2023-07-23 02:52:45'),
  },  {
    title: '吃饭',
    id: '3',
    time_project_id:'1',
    time:"02:40",
    start: new Date('2023-07-23 06:12:45'),
    end: new Date('2023-07-23 08:52:45'),
  },  {
    title: '自定义打印代码测试',
    id: '2',
    time:"00:40",
    time_project_id:'74',
    start: new Date('2023-07-23 09:12:45'),
    end: new Date('2023-07-23  09:52:45'),
  }, {
    title: '代码',
    id: '1',
    time_project_id:'1',
    time:"05:00",
    start: new Date('2023-07-23 12:12:45'),
    end: new Date('2023-07-23 17:12:45'),
  },
  // 添加更多事件...
];
const TimeTracker = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  
  const [timeProjectSelect, settimeProjectSelect] = useState<SelectPullDown[]>([]);
  // 打开时间编辑添加框
  const [TimeSheetFormStatus, {open:openTimeSheetForm,close:closeTimeSheetForm}] = useDisclosure(false);
  // 数据信息
  const [DataRow, SetDataRow] = useState<EventData>({
    title: '',
    id: '',
    start: '',
    end: '',
    time: '',
    time_project_id:'',
    sourceResource: '',
});
  // 定义表单标题
  const [formTitle, setFormTitle] = useState("");
  const handleEventClick = async (event:any) => {
    // 在这里处理事件点击逻辑
    console.log(event)
    setFormTitle('修改时间记录');
    const timeTrackProjectOption =  await getAllTimeTracker({type:'select'});
    console.log(timeTrackProjectOption)
    settimeProjectSelect(timeTrackProjectOption);
    openTimeSheetForm();
    SetDataRow(event);
  };
  // 表单操作后的回调
  const callbackHandle=()=>{
    // ajaxGetData();
    closeTimeSheetForm();
  }


  const handleSelectSlot = async (slotInfo: any) => {
    // 在控制台上打印所选的时间段信息
    SetDataRow({  title: '',   time_project_id:'',   id: '',      start: slotInfo.start,      end: slotInfo.end,      time: '',      sourceResource: '',  });
    
    const timeTrackProjectOption =  await getAllTimeTracker({type:'select'});
    settimeProjectSelect(timeTrackProjectOption);
    openTimeSheetForm();
    console.log('选择的时间段信息:', slotInfo);

  };

  return (
    <Box p={20} w="100%">
        {/* <Button
          color={dark?'blue':'dark'}
          variant="outline"
          onClick={() => openTimeSheetHandler("create")}
        >
         添加记录项目
        </Button> */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable={true}
        messages={{
          today: '今天',
          previous: '上一页',
          next: '下一页',
          month: '月',
          week: '周',
          day: '日',
          agenda: '议程',
          date: '日期',
          time: '时间',
          event: '事件',
        }}
        onSelectEvent={handleEventClick} // 添加事件点击回调函数
        onSelectSlot={handleSelectSlot}
        style={{ height: '50rem' }}
      /> 
      
       <Modal closeOnClickOutside={false} opened={TimeSheetFormStatus} size='xl' onClose={closeTimeSheetForm}  title={<Text fw={700}>{formTitle}</Text>}>
           <TimeSheetForm  callback={callbackHandle} Data={DataRow}  timeProjectSelect={timeProjectSelect}/>
      </Modal>
 </Box>
  );
};

export default TimeTracker;
