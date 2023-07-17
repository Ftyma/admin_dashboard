import React from "react";
import { Breadcrumb } from "antd";

type IBreadcrumb = {
  value: object[];
};

export default function Navbar(props: IBreadcrumb) {
  return <Breadcrumb items={props.value} />;
}
