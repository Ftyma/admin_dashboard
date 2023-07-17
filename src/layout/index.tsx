import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Layout, { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";

export default function index() {
  return (
    <Layout hasSider>
      <Sidebar />

      <Layout style={{ marginLeft: 50, justifyContent: "center" }}>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
