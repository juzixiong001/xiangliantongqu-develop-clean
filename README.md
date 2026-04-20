# 乡链通衢 - 乡村供需互联与惠农政策平台

## 项目简介

乡链通衢是一个专注于乡村供需互联和惠农政策推送的平台，致力于解决农村信息不对称问题，让农民能够更便捷地获取供需信息和政策支持。

## 技术栈

- **前端框架**：Vue 3 + Vite
- **UI组件库**：Element Plus
- **路由管理**：Vue Router
- **状态管理**：Vue 3 Composition API
- **样式**：CSS3 + SCSS
- **数据**：JSON 模拟数据（预留 API 接口）

## 核心功能

### 1. 首页
- 快捷入口（发布信息、浏览供需、政策匹配）
- 最新供需信息展示
- 热门政策推荐

### 2. 供需大厅
- 类型筛选（出售、求购、用工）
- 地区筛选
- 关键词搜索
- 供需信息卡片展示
- 详情查看

### 3. 惠农政策
- 政策库（分类浏览）
- 政策匹配（多步骤问卷）
- 政策详情查看

### 4. 发布信息
- 发布出售信息
- 发布求购信息
- 发布用工信息

### 5. 个人中心
- 个人信息管理
- 我的发布
- 收藏的政策

## 项目结构

```
xianglian/
├── public/              # 静态资源
├── src/
│   ├── assets/         # 图片、图标等资源
│   ├── data/           # 模拟数据
│   ├── router/         # 路由配置
│   ├── views/          # 页面组件
│   │   ├── HomeView.vue         # 首页
│   │   ├── SupplyDemandView.vue # 供需大厅
│   │   ├── SupplyDetailView.vue # 供需详情
│   │   ├── PolicyListView.vue   # 政策库
│   │   ├── PolicyDetailView.vue # 政策详情
│   │   ├── PublishView.vue      # 发布信息
│   │   ├── MyView.vue           # 个人中心
│   │   └── UserPublishView.vue  # 我的发布
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── .gitignore          # Git忽略文件
├── index.html          # HTML模板
├── package.json        # 项目配置
├── README.md           # 项目说明
└── vite.config.js      # Vite配置
```

## 安装与运行

### 环境要求
- Node.js 16.0 或更高版本
- npm 7.0 或更高版本

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 响应式设计

- 桌面端：1200px+ 宽屏布局
- 平板端：768px-1199px 适配布局
- 移动端：767px 以下单列布局

## 功能特点

1. **直观的用户界面**：采用现代化的设计风格，操作简单易懂
2. **便捷的供需匹配**：快速发布和浏览供需信息
3. **精准的政策匹配**：通过多维度问卷匹配适合的惠农政策
4. **完善的信息展示**：卡片式布局，信息层次清晰
5. **流畅的用户体验**：加载状态、空状态等细节处理

## 预留API接口

- `GET /api/supply` - 获取供需列表
- `GET /api/supply/:id` - 获取供需详情
- `POST /api/supply` - 发布供需信息
- `GET /api/policy` - 获取政策列表
- `GET /api/policy/:id` - 获取政策详情
- `POST /api/policy/match` - 政策匹配

## 项目截图

### 首页
![首页](https://a0ai.marscode.cn/api/ide/v1/text_to_image?prompt=modern%20rural%20platform%20homepage%20with%20green%20and%20blue%20color%20scheme%2C%20showing%20quick%20entry%20cards%20and%20latest%20information&image_size=landscape_16_9)

### 供需大厅
![供需大厅](https://a0ai.marscode.cn/api/ide/v1/text_to_image?prompt=supply%20and%20demand%20hall%20with%20filter%20bar%20and%20card%20grid%2C%20showing%20different%20types%20of%20rural%20supply%20and%20demand%20information&image_size=landscape_16_9)

### 政策匹配
![政策匹配](https://a0ai.marscode.cn/api/ide/v1/text_to_image?prompt=policy%20matching%20questionnaire%20with%20multiple%20steps%2C%20showing%20form%20fields%20and%20progress%20indicator&image_size=landscape_16_9)

## 注意事项

1. 本项目为前端演示版本，使用JSON模拟数据
2. 预留的API接口需要后端服务支持
3. 建议使用Chrome、Edge等现代浏览器访问
4. 如需部署到生产环境，请配置真实的API接口

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request，共同完善这个项目！