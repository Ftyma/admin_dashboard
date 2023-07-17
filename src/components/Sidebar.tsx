import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import {
  ContainerOutlined,
  DesktopOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  BarsOutlined,
  AppstoreOutlined,
  HomeOutlined,
  RightOutlined,
  LeftOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Flex, Button } from "@chakra-ui/react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

export default function Sidebar() {
  let location = useLocation();
  const isActive = location.pathname;
  const menuList = [
    { title: "Home", path: "/home", icon: <HomeOutlined /> },
    {
      title: "Product",
      path: "/product",
      icon: <DesktopOutlined />,
      subMenu: [
        {
          title: "Categories",
          path: "/product/category",
          icon: <AppstoreOutlined />,
        },
        { title: "Items", path: "/product/items", icon: <BarsOutlined /> },
      ],
    },
    { title: "Cart", path: "/cart", icon: <ShoppingCartOutlined /> },
    { title: "History", path: "/history", icon: <ContainerOutlined /> },
    { title: "Profile", path: "/profile", icon: <UserOutlined /> },
    { title: "Trash", path: "/trash", icon: <DeleteOutlined /> },
    { title: "Logout", path: "/logout", icon: <LogoutOutlined /> },
  ];

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{ width: "10%" }}>
      <Flex height={"100vh"} position={"fixed"}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Menu
            mode="inline"
            theme="dark"
            inlineCollapsed={collapsed}
            selectedKeys={[isActive]}
            style={{ flex: "1" }}
          >
            {menuList.map((item) =>
              item.subMenu ? (
                <Menu.SubMenu
                  key={item.path}
                  title={item.title}
                  icon={item.icon}
                >
                  {item.subMenu.map((i) => (
                    <Menu.Item key={i.path} icon={i.icon}>
                      <Link to={i.path}> {i.title}</Link>
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ) : (
                <Menu.Item key={item.path} icon={item.icon}>
                  <Link to={item.path}> {item.title}</Link>
                </Menu.Item>
              )
            )}
          </Menu>
          <Button
            onClick={toggleCollapsed}
            color="white"
            variant={"unstyled"}
            style={{
              position: "fixed",
              bottom: 0,
              width: "100%",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",

              // backgroundColor: "transparent",
            }}
          >
            {collapsed ? <LeftOutlined /> : <RightOutlined />}
          </Button>
        </div>
      </Flex>
    </div>
  );
}
