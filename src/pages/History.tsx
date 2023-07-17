import React, { useRef, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { InputRef, Tag } from "antd";
import { Button, Input, Space, Table, message, Popconfirm } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import moment from "moment";

import { Currency } from "../components/Currency";

import Highlighter from "react-highlight-words";
import axios from "axios";
import PopularProduct from "../components/PopularProduct";
import OrderDetailModal from "../components/OrderDetailModal";
import UpdateStatus from "../components/UpdateStatus";

interface OrderType {
  status: string;
  date: Date;
  uid: string;
  orders: OrderProductType[];
}

interface OrderProductType {
  id: number;
  product_name: string;
  description: string;
  price: number;
  quantity: number;
  productStatus: number;
}

type DataIndex = keyof OrderType;

export default function History() {
  const [orderList, setOrderList] = useState<OrderType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const url = import.meta.env.VITE_API;

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      await axios.get(`${url}orders/all`).then((res) => {
        setOrderList(res.data);
        console.log("order list", res.data);
      });
    } catch (error) {
      console.log("error fetch order list");
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
  ): ColumnType<OrderType> => ({
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
      dataIndex === "date" ? (
        <span>{moment(text).format("DD/MM/YYYY")}</span>
      ) : searchedColumn === dataIndex ? (
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

  const columns: ColumnsType<OrderType> = [
    {
      title: "Customer ID",
      dataIndex: "uid",
      key: "uid",
      width: "20%",
      ...getColumnSearchProps("uid"),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "10%",
      render: (_, record) => (
        <span>
          {" "}
          <span>{moment(record.date).format("DD/MM/YYYY")}</span>
        </span>
      ),
    },
    // {
    //   title: "Order ID",
    //   dataIndex: "_id",
    //   key: "_id",
    //   width: "5%",
    //   render: (_, record) => (
    //     <>
    //       {record.orders.map((item) => (
    //         <span key={item.id}>{item._id}</span>
    //       ))}
    //     </>
    //   ),
    // },
    {
      title: "Total Price",
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (_, record) => {
        let total: number = 0;
        record.orders.forEach((item) => {
          total += item.price * item.quantity;
        });
        return <span>{Currency(total)}</span>;
      },
    },

    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => {
        let color = status.length > 5 ? "geekblue" : "green";
        if (status === "Not Processed") {
          color = "orange";
        } else if (status === "Delivered") {
          color = "green";
        } else if (status === "Processing") {
          color = "geekblue";
        } else {
          color = "red";
        }
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      render: (_, record) => {
        return (
          <>
            <OrderDetailModal productId={record._id} />
            <UpdateStatus _id={record._id} setOrderList={setOrderList} />
          </>
        );
      },
    },
  ];

  return (
    <>
      <PopularProduct
        itemList={orderList}
        getProductId={getProductId}
        getProductName={getProductName}
      />
      <Table
        columns={columns}
        dataSource={orderList}
        pagination={{ position: ["bottomCenter"] }}
      />
    </>
  );
}
