import React, { useState } from "react";
import { Select } from "antd";
import axios from "axios";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { DownOutlined } from "@ant-design/icons";

const { Option } = Select;

const items = [
  {
    key: "Not Processed",
    label: "Not Processed",
  },
  {
    key: "Processing",
    label: "Processing",
  },
  {
    key: "Cancelled",
    label: "Cancelled",
  },
  {
    key: "Delivered",
    label: "Delivered",
  },
];

const UpdateStatus = ({ _id, setOrderList }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const url = import.meta.env.VITE_API;

  const handleStatus = async (value) => {
    try {
      setSelectedStatus(value);

      console.log("value", value);
      console.log("selected status", selectedStatus);

      const res = await axios.put(`${url}orders/updateStatus`, {
        _id,
        status: value,
      });

      setOrderList((prevOrderList) =>
        prevOrderList.map((order) =>
          order._id === _id ? { ...order, status: value } : order
        )
      );

      console.log("Status updated successfully", res.data);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error);
    }
  };

  return (
    // <Select
    //   value={selectedStatus}
    //   onChange={handleStatus}
    //   style={{ width: 150 }}
    // >
    //   <Option value="" disabled>
    //     Update status
    //   </Option>
    //   {items.map((item) => (
    //     <Option key={item.key} value={item.key}>
    //       {item.label}
    //     </Option>
    //   ))}
    // </Select>
    <Menu>
      <MenuButton color={"blue"}>
        Update Status
        <DownOutlined style={{ fontSize: "12px", marginLeft: "5px" }} />
      </MenuButton>

      <MenuList>
        <MenuOptionGroup onChange={handleStatus} value={selectedStatus}>
          {items.map((item) => (
            <MenuItemOption key={item.key} value={item.key}>
              {item.label}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default UpdateStatus;
