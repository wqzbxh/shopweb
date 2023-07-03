import { Box, Text } from "@mantine/core";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // 导入编辑器样式
import { FormEvent, SetStateAction, useEffect, useState } from "react";

interface RichTextEditor {
  callBack: (value:string) => void;
  [key: string]: any;
}

const modules = {
  toolbar: {
    container: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }], //字体设置
      [
        {
          color: [],
        },
      ],
      [
        {
          background: [],
        },
      ],
      [{ font: [] }],
      [{ align: [] }],
      ['link', 'image'], // a链接和图片的显示
    ],
  },
};
export default function RichTextEditor({ content,callBack }: RichTextEditor) {
 
// 接收值并且传出上一级
  const descHandler =(value:string)=>{
    callBack(value)
  }
  return (
    <Box  mih={400} mt={10}>
      <Text fw={500} size='sm'>描述</Text>
      <ReactQuill
        className="publish-quill"
        placeholder="请输入容"
        theme="snow"
        defaultValue={content}
        onChange={descHandler}
        style={{height:300}}
        modules={modules}
      />
    </Box>
  )
}

