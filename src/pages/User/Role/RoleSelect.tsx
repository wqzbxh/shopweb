import { useListState, randomId } from "@mantine/hooks";
import { Box, Checkbox, Grid, Group, Text, Title } from "@mantine/core";
import { MenuItem } from "../../../interface/Irole";
import { useState } from "react";


interface IndeterminateCheckboxProps {
  items: MenuItem[];
  menuId:string[];
  callback:(value: string[]) => void;
}
export function IndeterminateCheckbox({
  items,
  menuId,
  callback,
}: IndeterminateCheckboxProps) {
  const [menuid, setMenuId] = useState<string[]>(menuId);
  const handlerSelect = (value: string[]) => {
    setMenuId(value);
    callback(value);
  };
  return (
    <>
      <Checkbox.Group value={menuid} onChange={handlerSelect}>
        <Grid columns={12}>
          {items.map((item, index) => (
              <Grid.Col key={index+item.menu_name} span={2}>
                <Checkbox
                  mt={5}
                  value={item.id.toString()}
                  label={item.menu_name}
                />
                {item.children.length > 0
                  ? item.children.map((childrenitem, childrenindex) => (
                      <Checkbox
                      key={childrenitem.id+childrenitem.menu_name}
                        mt={5}
                        value={childrenitem.id.toString()}
                        label={childrenitem.menu_name}
                      />
                    ))
                  : null}
              </Grid.Col>
          ))}
        </Grid>
      </Checkbox.Group>
    </>
  );
}
