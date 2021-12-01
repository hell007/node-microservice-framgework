## node-microservice-framgework

### NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run lint`: Run ESLint
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose


### 使用总结


 #### 1. action

 当自己写的action与框架提供的action名称相同时，需要改写action.

 列如：find, count, list, get, insert, remove，insert 需要改写
 create, update 可以形同 因为api上没有参数

 
 #### 2. hooks的调用顺序

 ```
 before hooks: global (*) -> service level -> action level.
 after hooks: action level -> service level -> global (*).
 ```

 ### 3. settings
 
 不修改的action 会使用settings里面的属性，修改过的action 查询返回的字段不知道怎么配置

