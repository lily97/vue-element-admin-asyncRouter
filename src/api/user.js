import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/login",
    method: "post",
    data,
  });
}

export function getInfo(params) {
  return request({
    url: "/admin/login-info",
    method: "get",
    params,
  });
}

export function logout() {
  return request({
    url: "/vue-admin-template/user/logout",
    method: "post",
  });
}

// -----------------菜单管理-----------------
export function getMenuList(params) {
  return request({
    url: "/admin/menu/list",
    method: "get",
    params,
  });
}

// -----------------角色管理-----------------
export function getRoleList(params) {
  return request({
    url: "/admin/role/list",
    method: "get",
    params,
  });
}

export function addRole(data) {
  return request({
    url: "/admin/role/create",
    method: "post",
    data,
  });
}

export function updRole(data) {
  return request({
    url: "/admin/role/update",
    method: "post",
    data,
  });
}

export function delRole(data) {
  return request({
    url: "/admin/role/remove",
    method: "post",
    data,
  });
}

// -----------------员工管理-----------------
export function getUserList(params) {
  return request({
    url: "/admin/user/list",
    method: "get",
    params,
  });
}

export function addUser(data) {
  return request({
    url: "/admin/user/create",
    method: "post",
    data,
  });
}

export function updUser(data) {
  return request({
    url: "/admin/user/update",
    method: "post",
    data,
  });
}

export function delUser(data) {
  return request({
    url: "/admin/user/remove",
    method: "post",
    data,
  });
}

export function switchUser(data) {
  console.log(data,'datadata');
  return request({
    url: "/admin/user/switch",
    method: "post",
    data,
  });
}

export function resetPwd(data) {
  return request({
    url: "/admin/user/reset-pwd",
    method: "post",
    data,
  });
}
