import { Container, Flex, Grid, Group, SimpleGrid, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import localstorageUnits from "../../utils/localstorageUnits";
import memoryUtils from "../../utils/memoryUtils";
import GoodGategory from "../Goods/Category/Category";
import HeaderSearch from "../Headernav/HeaderNav";
import Home from "../Home/Home";
import { Left } from "../LeftNav/LeftNav";
import RoleIndex from "../User/Role/RoleIndex";
import UserIndex from "../User/UserIndex";

function Admin() {
  
  const [routePath, setRoutePath] = useState("");
  const callBread = () => {
    let storagePath = localstorageUnits.getPath();
    if (storagePath && Object.keys(storagePath).length > 0) {
   
      setRoutePath(storagePath.currentUrl);
    }
  };
  
  const navigate = useNavigate();

    const links = [
        {
          "link": "/about",
          "label": "Features"
        },
        {
          "link": "/pricing",
          "label": "Pricing"
        },
        {
          "link": "/learn",
          "label": "Learn"
        },
        {
          "link": "/community",
          "label": "Community"
        }
      ]
  return (
    
    // 
    // <Left />  
    <>
    <HeaderSearch links={links}/>
      {/* <Grid gutter={0} >
      <Grid.Col span={3}><Left /> </Grid.Col>
      <Grid.Col span={9}  style={{ textAlign: 'left' }} >
        

      </Grid.Col>
    </Grid> */}
    <Flex  align="flex-start" 
      justify="flex-start">
        <Left  callback={callBread}/>
        <Routes >
            <Route path="/home" element={<Home/>} > </Route>
            <Route path="/goods_catregory" element={<GoodGategory/>} > </Route>
            <Route path="/user" element={<UserIndex/>} > </Route>
            <Route path="/user_role" element={<RoleIndex/>} > </Route>
        </Routes>
    </Flex>
      </>
  );
}
export default  Admin