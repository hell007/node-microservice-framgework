/*
 * @Descripttion:
 * @Author: zenghua.wang
 * @Date: 2021-11-30 09:22:00
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-11-30 10:08:09
  200 OK 客户端请求成功
  301 Moved Permanently 请求永久重定向
  302 Moved Temporarily 请求临时重定向
  304 Not Modified 文件未修改，可以直接使用缓存的文件。
  400 Bad Request 由于客户端请求有语法错误，不能被服务器所理解。
  401 Unauthorized 请求未经授权。这个状态代码必须和WWW-Authenticate报头域一起使用
  403 Forbidden 服务器收到请求，但是拒绝提供服务。服务器通常会在响应正文中给出不提供服务的原因
  404 Not Found 请求的资源不存在，例如，输入了错误的URL
  500 Internal Server Error 服务器发生不可预期的错误，导致无法完成客户端的请求。
  503 Service Unavailable 服务器当前不能够处理客户端的请求，在一段时间之后，服务器可能会恢复正常
 */
module.exports = {
  methods: {
    /**
     * 查询列表
     * @param {*} searchKey
     * @param {*} searchFields
     * @param {*} pageNum
     * @param {*} pageSize
     * @returns
     */
    async findList(searchKey = '', searchFields = [], pageNum = 1, pageSize = 10) {
      let condition = {};
      if (searchKey) {
        condition.search = searchKey;
        condition.searchFields = searchFields;
      }
      const total = await this.adapter.count(condition);
      condition.limit = parseInt(pageSize);
      condition.offset = pageSize * (pageNum - 1);
      const data = await this.adapter.find(condition);
      let result = {
        rows: data,
        total: total,
        page: parseInt(pageNum),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(total / pageSize),
      };
      return result;
    },
    /**
     * 返回成功结果
     * @param {*} data
     * @param {*} message
     * @returns
     */
    ok(data = null, message = '操作成功！') {
      return {
        code: 200,
        state: true,
        data: data,
        message: message,
      };
    },
    /**
     * 返回失败结果
     * @param {*} data
     * @param {*} message
     * @returns
     */
    failur(data = null, message = '操作失败！') {
      return {
        code: 200,
        state: false,
        data: data,
        message: message,
      };
    },
    /**
     * 返回错误结果
     * @param {*} message
     * @param {*} data
     * @param {*} code
     * @returns
     */
    error(message = '操作出错了！', data = null, code = 500) {
      return {
        code: code,
        state: false,
        data: data,
        message: message,
      };
    },
  },
};
