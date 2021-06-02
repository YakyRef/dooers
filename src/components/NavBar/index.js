import { PageHeader, Button } from "antd";
import React from "react";

export default function NavBar({ logout, user }) {
  return (
    <PageHeader
      className="site-page-header-responsive"
      subTitle={`Hello ${user.displayname || user.email}`}
      extra={[
        <Button key="1" onClick={() => logout()}>
          Log Out
        </Button>,
      ]}
    />
  );
}
