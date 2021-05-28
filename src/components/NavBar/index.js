import React from "react";

export default function NavBar({ logout, user }) {
  return (
    <div>
      <button onClick={() => logout()}>Log Out</button>
      <span>Hello {user.displayname || user.email}</span>
    </div>
  );
}
