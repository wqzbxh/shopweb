import { Container, Flex, Grid, Group, SimpleGrid, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import localstorageUnits from "../../utils/localstorageUnits";
import memoryUtils from "../../utils/memoryUtils";
import GoodGategory from "../Goods/Category/Category";
import Goods from "../Goods/Goods/Goods";
import Specification from "../Goods/Specification/Specification";
import HeaderSearch from "../Headernav/HeaderNav";
import Home from "../Home/Home";
import { Left } from "../LeftNav/LeftNav";
import Login from "../Login/Login";
import Project from "../TimeMange/Project/Project";
import TimeTracker from "../TimeMange/TimeSheet/TimeTracker";
import RoleIndex from "../User/Role/RoleIndex";
import UserIndex from "../User/User/UserIndex";

function Admin() {

  const [routePath, setRoutePath] = useState("");
  const navigate = useNavigate();
  const userid = memoryUtils.user.user_id;
  console.log(userid)
  if(!userid)
  {
    return <Login/>
  }
  const callBread = () => {
    let storagePath = localstorageUnits.getPath();
    if (storagePath && Object.keys(storagePath).length > 0) {
   
      setRoutePath(storagePath.currentUrl);
    }
  };
  

    const links = [
        {
          "link": "/about",
          "label": "关于我们"
        },
        {
          "link": "/pricing",
          "label": "价格"
        },
        {
          "link": "/learn",
          "label": "学习"
        },
        {
          "link": "/community",
          "label": "联系方式"
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
            <Route path="/" element={<Home/>} > </Route>
            <Route path="/home" element={<Home/>} > </Route>
            <Route path="/goods_catregory" element={<GoodGategory/>} > </Route>
            <Route path="/goods" element={<Goods/>} > </Route>
            <Route path="/user" element={<UserIndex/>} > </Route>
            <Route path="/specification" element={<Specification/>} > </Route>
            <Route path="/user_role" element={<RoleIndex/>} > </Route>
            <Route path="/time_project" element={<Project/>} > </Route>
                <Route path="/time_sheet" element={<TimeTracker/>} > </Route>
        </Routes>
    </Flex>
      </>
  );
}
export default  Admin