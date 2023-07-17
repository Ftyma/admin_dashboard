import React, { useRef, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, Input, Space, Table, message, Popconfirm } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";

import Highlighter from "react-highlight-words";
import axios from "axios";
import { Currency } from "../components/Currency";
import CartDetailModal from "../components/CartDetailModal";

interface CartType {
  uid: string;
  id: number;
  product_name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
  orderby: string;
}

type DataIndex = keyof CartType;

export default function Cart() {
  const [cartList, setCartList] = useState<CartType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const url = import.meta.env.VITE_API;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      await axios.get(`${url}cart/all`).then((res) => {
        const updatedCartList = res.data.map((item, index) => ({
          ...item,
          _id: index.toString(),
        }));

        setCartList(updatedCartList);
        console.log("users list", updatedCartList);
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
  ): ColumnType<CartType> => ({
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

  const columns: ColumnsType<CartType> = [
    {
      title: "User ID",
      dataIndex: "uid",
      key: "uid",
      width: "20%",
      render: (text, record, index) => {
        const isFirstRowWithSameUid =
          index === 0 || record.uid !== cartList[index - 1].uid;
        return {
          children: isFirstRowWithSameUid ? text : null,
          props: {
            rowSpan: isFirstRowWithSameUid
              ? cartList.filter((item) => item.uid === record.uid).length
              : 0,
          },
        };
      },
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record, index) => {
        const isFirstRowWithSameUid =
          index === 0 || record.uid !== cartList[index - 1].uid;
        const sumQuantity = cartList
          .filter((item) => item.uid === record.uid)
          .reduce((total, item) => total + item.quantity, 0);

        return {
          children: isFirstRowWithSameUid ? <span>{sumQuantity}</span> : null,
          props: {
            rowSpan: isFirstRowWithSameUid
              ? cartList.filter((item) => item.uid === record.uid).length
              : 0,
          },
        };
      },
    },

    {
      title: "Total Price",
      dataIndex: "price",
      key: "price",
      render: (text, record, index) => {
        const isFirstRowWithSameUid =
          index === 0 || record.uid !== cartList[index - 1].uid;
        const sumQuantity = cartList
          .filter((item) => item.uid === record.uid)
          .reduce((total, item) => total + item.quantity * item.price, 0);

        return {
          children: isFirstRowWithSameUid ? (
            <span>{Currency(sumQuantity)}</span>
          ) : null,
          props: {
            rowSpan: isFirstRowWithSameUid
              ? cartList.filter((item) => item.uid === record.uid).length
              : 0,
          },
        };
      },
    },

    {
      title: "Action",
      render: (_, record, index) => {
        const isFirstRowWithSameUid =
          index === 0 || record.uid !== cartList[index - 1].uid;
        return {
          children: isFirstRowWithSameUid ? (
            <CartDetailModal uid={record.uid} />
          ) : null,
          props: {
            rowSpan: isFirstRowWithSameUid
              ? cartList.filter((item) => item.uid === record.uid).length
              : 0,
          },
        };
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={cartList}
      rowKey="_id"
      style={{ justifyContent: "center" }}
    />
  );
}
