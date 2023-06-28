import { useForm } from '@mantine/form';
import { Box, TextInput, NumberInput, Button, Group } from '@mantine/core';
import { IndeterminateCheckbox } from './RoleSelect';
import { MenuItem } from '../../../interface/Irole';

interface IMenuItemProps{
    MenuItem:MenuItem[]
}
export  function RoleForm({MenuItem}:IMenuItemProps) {
  const form = useForm<{ name: string;}>({
    initialValues: { name: '' },
    validate: (values) => ({
      name: values.name.length < 2 ? 'Too short name' : null,
    }),
  });
  console.log(MenuItem)

  const checkBox = MenuItem ? MenuItem.map((item,index)=>{
    return (
          <IndeterminateCheckbox items={item} />
    )
  }) :'none';
  return (
    <Box maw={340} mx="auto">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput label="Name" placeholder="Name" {...form.getInputProps('name')} />
        {checkBox}
        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}