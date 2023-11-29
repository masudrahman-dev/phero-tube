"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Badge, Space, Switch } from "antd";
import { Button, Col, Layout, Menu, Row, Spin, theme } from "antd";
import Image from "next/image";
import logo from "../assets/Logo.png";
import Link from "next/link";

import { Avatar, Card } from "antd";

import axios from "axios";

const { Meta } = Card;

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [authors, setAuthers] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, category1000Response] = await Promise.all([
          axios.get(
            "https://openapi.programming-hero.com/api/videos/categories"
          ),
          axios.get(
            "https://openapi.programming-hero.com/api/videos/category/1000"
          ),
        ]);

        if (
          categoriesResponse.status === 200 &&
          category1000Response.status === 200
        ) {
          const categoriesData = categoriesResponse?.data?.data;
          const category1000Data = category1000Response?.data?.data;
          console.log("category1000Data", category1000Data);

          setData(category1000Data);
          setCategories(categoriesData);
          setLoading(false);
        }
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const authersArr: any = data.map((item: any) => {
      return item.authors;
    });
    setAuthers(authersArr.flat());
  }, [loading]);

  if (loading) {
    return <Spin />;
  }
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <div className=" container mx-auto flex justify-between items-center  px-7">
              <div>
                <Link href={"/"}>
                  <Image src={logo} alt="logo" />
                </Link>
              </div>
              <div>
                <Button>Sort By New</Button>
              </div>
              <div>
                <Button>Blog</Button>
              </div>
            </div>
          </Header>

          <Content className="mt-12">
            <div className="grid grid-cols-1 lg:flex gap-5 px-7 justify-center">
              {categories?.map(({ category_id, category }) => {
                return <Button key={category_id}>{category}</Button>;
              })}
            </div>

            <section className=" container mx-auto ">
              <div className="sm:flex sm:flex-col lg:grid lg:grid-cols-3 xl:grid-cols-4 justify-center my-12 px-7 gap-7  lg:-items-baseline">
                {data?.map((item: any, index) => {
                  return (
                    <Card
                      key={`${item.category_id}_${index}`}
                      hoverable
                      style={{ width: 300, marginBottom: 30 }}
                      cover={<img alt="example" src={item.thumbnail} />}
                      actions={[
                        item?.others?.views,
                        "Posted: " + item?.others?.posted_date,
                      ]}
                    >
                      <Meta
                        avatar={
                          <Avatar
                            src={
                              authors[index]?.profile_picture ||
                              "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
                            }
                          />
                        }
                        title={authors[index]?.profile_name}
                        description={item?.title}
                      />
                    </Card>
                  );
                })}
              </div>
            </section>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2023 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}
