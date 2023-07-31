import { HintInfoClien } from "./function";

// 定义输入参数类型
type DateString = string;

// 定义函数返回值类型
type TimeInterval = string;

// 封装的函数
export function calculateTimeInterval(startTime: DateString, endTime: DateString): TimeInterval {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    if(endDate<startDate){
        return '00:00';
    }
    // 计算时间差（毫秒）
    const timeDifference = endDate.getTime() - startDate.getTime();
  
    // 转换为小时和分钟
    const hours = Math.floor(timeDifference / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    // if(hours>'24'){
    //   HintInfoClien({color:'yellow',msg:'时间已超出24小时，自动归置为23:59'});
    //   return '23:59';
    // }
    // 格式化为字符串
    const timeInterval = `${hours}:${minutes}`;
  
    return timeInterval;
  }
  


export const calculateTime = (timeInterval: string): [Date, Date] => {
    const [hours, minutes] = timeInterval.split(':').map((str) => parseInt(str, 10));
    const currentTime = new Date();
    console.log(1)
    // 计算时间间隔对应的毫秒数
    const timeDifference = hours * 60 * 60 * 1000 + minutes * 60 * 1000;
  
    // 计算开始时间的时间戳
    const startTimeStamp = currentTime.getTime() - timeDifference;
  
    // 构造开始时间和结束时间的 Date 对象
    const startTime = new Date(startTimeStamp);
    const endTime = currentTime;
  
    return [startTime, endTime];
  };

  
// 将Time转变成 00:00 型式 ，如果 为字符串整型，则进行拼接分钟
export function TimeHHSS(event: React.FocusEvent<HTMLInputElement>) {
    let value = event.target.value;
    console.log(value);
    value = value.replace(/：/g, ":"); // 将中文冒号替换为英文冒号
    // 检查value是否为字符串数字
    if (!isNaN(Number(value))) {
      let formattedTime = "";
      if (value.includes(":")) {
        // 时间已经是"hh:mm"格式，保持原样
        formattedTime = value;
      } else {
        // 时间是"hhmm"格式，补全为"hh:mm"
        const hours = value.padStart(2, '0'); // 在字符串前补充0，使小时部分总是两位数
        const minutes = '00';
        formattedTime = `${hours}:${minutes}`;
      }
      // 输出格式化的值
      return formattedTime;
    } else {
      // 输出原始值
      return value;
    }
  };
  