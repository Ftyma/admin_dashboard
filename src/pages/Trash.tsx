import React, { useRef, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, Input, Space, Table, message, Popconfirm } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";

import { Currency } from "../components/Currency";

import Highlighter from "react-highlight-words";
import axios from "axios";

interface ProductType {
  id: number;
  sku: string;
  product_name: string;
  description: string;
  price: number;
  image: string;
  group_id: number;
  category: number[];
  quanitity: number;
}

type DataIndex = keyof ProductType;

export default function Categories() {
  const [itemList, setItemList] = useState<ProductType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const url = import.meta.env.VITE_API;

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      await axios.get(`${url}trash/all`).then((res) => {
        setItemList(res.data);
        console.log("trash list", res.data);
      });
    } catch (error) {
      console.log("error fetch trash list");
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

  const handleRecover = async (productId) => {
    try {
      await axios.patch(`${url}trash/recover/${productId}`);
      //fetchProduct();
      setItemList((prevProductList) =>
        prevProductList.filter((product) => product.id !== productId)
      );
      message.success("Sucessfully Recovered.");
    } catch (error) {
      console.log("Error recovering product:", error);
    }
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<ProductType> => ({
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
    render: (text, record) =>
      dataIndex === "image" ? (
        <img src={text} style={{ width: "100px" }} />
      ) : dataIndex === "category" ? (
        record.category.join(", ")
      ) : dataIndex === "price" ? (
        <span>{Currency(text)}</span>
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

  const columns: ColumnsType<ProductType> = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "10%",
      ...getColumnSearchProps("image"),
    },
    {
      title: "Product_name",
      dataIndex: "product_name",
      key: "product_name",
      width: "20%",
      ...getColumnSearchProps("product_name"),
    },
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
      width: "10%",
      ...getColumnSearchProps("sku"),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "10%",
      ...getColumnSearchProps("price"),
      sorter: (a, b) => a.price.length - b.price.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "10%",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "10%",
      ...getColumnSearchProps("description"),
    },
    {
      title: "Group_id",
      dataIndex: "group_id",
      key: "group_id",
      width: "5%",
      ...getColumnSearchProps("group_id"),
    },
    {
      title: "Action",
      render: (_, record) => {
        return (
          <>
            <Popconfirm
              title="Are you sure to recover this product?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleRecover(record.id)}
            >
              <Button type="link">Recover</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return <Table columns={columns} dataSource={itemList} />;
}
