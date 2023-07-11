import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Group, Text, useMantineTheme, rem, Image, Button } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconCheck, IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

interface UploadSingleImageComponentProps {
  onImageValueCallback: (value: string) => void;
  imagePath?: string;
  w: number;
  h: number;
  wImage: number;
  hImage: number;
}

const UploadSingleImage: React.FC<UploadSingleImageComponentProps & Partial<DropzoneProps>> = (props) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedImageArr, setSelectedImageArr] = useState<string[]>([]);
  
  useEffect(() => {
    setSelectedImage(props.imagePath || '');
  }, [props.imagePath]);

  const handleImageUpload = async (files: File[]) => {
    const updatedSelectedImageArr = [
      ...selectedImageArr,
      ...files.map((item) => URL.createObjectURL(item)),
    ];
    setSelectedImageArr(updatedSelectedImageArr);
    setSelectedImage(updatedSelectedImageArr[0]);

    console.log(files);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('image', file);
    });
  };


  const handleDeleteImage = (index: number) => {
    const updatedSelectedImageArr = [...selectedImageArr];
    updatedSelectedImageArr.splice(index, 1);
    setSelectedImageArr(updatedSelectedImageArr);
    setSelectedImage(updatedSelectedImageArr[0]);
  };

  const theme = useMantineTheme();
  return (
    <div>
      <Dropzone 
        style={{ width:props.wImage/3, height: props.hImage/3 }}
        onDrop={(files) => handleImageUpload(files)}
        onReject={(files) => console.log('rejected files', files)}
        accept={IMAGE_MIME_TYPE}
        {...props}
      >
        <span></span>
      </Dropzone>

      <Group position="left" spacing="xl">
        {selectedImageArr.length > 0 ? (
          selectedImageArr.map((image, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <Image mx="auto" radius="md" src={image} width={props.wImage/2} height={props.hImage/2} />
              <Button
                variant="light"
                size="xs"
                style={{ position: 'absolute', top: '5px', right: '5px' }}
                onClick={() => handleDeleteImage(index)}
                title="Delete Image"
              >
                <IconX />
              </Button>
            </div>
          ))
        ) : (
          <>
            <div>
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed 5mb
              </Text>
            </div>
          </>
        )}
      </Group>
    </div>
  );
};

export default UploadSingleImage;
