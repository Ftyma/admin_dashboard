import React, { useRef, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { InputRef, Tag } from "antd";
import { Button, Input, Space, Table, message, Popconfirm } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";

import Highlighter from "react-highlight-words";
import axios from "axios";

interface UserType {
  uid: string;
  username: string;
  email: string;
  password: string;
  disabled: boolean;
}

type DataIndex = keyof UserType;

export default function Profile() {
  const [userList, setUserList] = useState<UserType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const url = import.meta.env.VITE_API;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      await axios.get(`${url}users/all`).then((res) => {
        setUserList(res.data);
        console.log("users list", res.data);
      });
    } catch (error) {
      console.log("error fetch users list");
    }
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<UserType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleDisable = async (uid) => {
    try {
      await axios.put(`${url}users/disable`, { uid }).then((res) => {
        console.log(res.data);
      });

      setUserList((prevUserList) =>
        prevUserList.map((user) =>
          user.uid === uid ? { ...user, disabled: true } : user
        )
      );
    } catch (error) {
      console.log("error disable user", error);
    }
  };

  const handleEnable = async (uid) => {
    try {
      await axios.put(`${url}users/enable`, { uid }).then((res) => {
        console.log(res.data);
      });
      setUserList((prevUserList) =>
        prevUserList.map((user) =>
          user.uid === uid ? { ...user, disabled: false } : user
        )
      );
    } catch (error) {
      console.log("error enable user", error);
    }
  };

  const columns: ColumnsType<UserType> = [
    {
      title: "User ID",
      dataIndex: "uid",
      key: "uid",
      width: "30%",
      ...getColumnSearchProps("uid"),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: "10%",
      ...getColumnSearchProps("username"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Active",
      render: (_, record) => {
        if (record.disabled === true) {
          return (
            <Tag color="red">
              <span>No</span>
            </Tag>
          );
        } else if (record.disabled === false) {
          return (
            <Tag color="green">
              <span>Yes</span>
            </Tag>
          );
        }
      },
    },
    {
      title: "Action",
      render: (_, record) => {
        if (record.disabled === false) {
          return (
            <Popconfirm
              title="Are you sure to disable this user?"
              onConfirm={() => handleDisable(record.uid)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link">Disable</Button>
            </Popconfirm>
          );
        } else if (record.disabled === true) {
          return (
            <Popconfirm
              title="Are you sure to enable this user?"
              onConfirm={() => handleEnable(record.uid)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link">Enable</Button>
            </Popconfirm>
          );
        }
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={userList}
      style={{ justifyContent: "center" }}
    />
  );
}
