# Node Express Boilerplate

## 使用说明

### 协同开发（新成员加入）

如果你是第一次加入这个项目，请按以下步骤完成环境初始化：

1. **克隆代码仓库**

   ```bash
   git clone <repository-url>
   cd node-express-boilerplate
   ```

2. **安装依赖**

   ```bash
   pnpm install --frozen-lockfile
   ```

3. **配置环境变量**

   创建 `.env` 文件（可参考 `.env.example` 如果存在），配置数据库连接：

   ```bash
   DATABASE_URL="postgresql://app:app@localhost:5432/node_express_boilerplate?schema=public"
   ```

4. **启动数据库**

   使用 Docker 启动 PostgreSQL 数据库：

   ```bash
   docker compose --profile dev up -d db
   ```

5. **初始化数据库**

   **注意**：项目已经包含 Prisma 配置和迁移文件，**不需要执行 `prisma init`**。

   运行数据库迁移以创建表结构：

   ```bash
   pnpm prisma migrate dev
   ```

   这会：
   - 应用所有待执行的迁移文件
   - 生成 Prisma Client（`pnpm prisma generate` 会自动执行）

6. **启动开发服务器**
   ```bash
   pnpm dev
   ```

**常见问题：**

- 如果数据库连接失败，检查 Docker 容器是否正常运行：`docker compose ps`
- 如果迁移失败，确保数据库已启动且 `DATABASE_URL` 配置正确
- 如果 Prisma Client 未生成，手动执行：`pnpm prisma generate`

## 开发流程

- 依赖：Node.js 20、pnpm（建议开启 corepack），本地需有 Docker。
- 启动数据库（dev profile 只起 Postgres）：`docker compose --profile dev up -d db`
- 准备环境变量：`.env` 中配置 `DATABASE_URL` 指向容器内数据库，例如 `postgresql://app:app@localhost:5432/node_express_boilerplate?schema=public`。
- 安装依赖：`pnpm install --frozen-lockfile`
- 初始化/同步数据库（按需选择其一）：
  - 迁移（推荐开发态）：`pnpm prisma migrate dev --name init`
  - 或仅推送模型：`pnpm prisma db push`
- 本地开发启动：`pnpm dev`（使用 `tsx watch src/server.ts`，连接刚才的容器数据库）

## 生产部署（Docker）

- 准备 `.env.docker`（包含 `DATABASE_URL` 等生产变量）。
- 构建镜像：`docker build -t node-express-boilerplate .`
- 单容器运行：`docker run --env-file .env.docker -p 8090:8090 node-express-boilerplate`
  - 容器入口会执行 `pnpm prisma migrate deploy`，需确保数据库可连通。
- 使用 docker-compose（包含 Postgres）：
  - `docker compose --profile prod up -d`
  - 应用暴露 `8090` 端口；数据库数据保存在卷 `postgres_data`。

## 关于 TypeScript 导入路径的说明

### 为什么使用 `.js` 而不是 `.ts` 扩展名？

在本项目中，你会看到所有的 import 语句都使用 `.js` 扩展名，例如：

```typescript
import { HttpError } from '../utils/httpError.js'
```

而不是：

```typescript
import { HttpError } from '../utils/httpError.ts' // ❌ 错误
```

**原因如下：**

1. **ES 模块规范要求**：本项目使用 ES 模块（`package.json` 中设置了 `"type": "module"`），ES 模块规范要求导入语句必须包含完整的文件扩展名。

2. **指向编译后的文件**：TypeScript 会将 `.ts` 文件编译成 `.js` 文件。导入路径中的扩展名应该对应编译后的文件类型，而不是源文件类型。

3. **NodeNext 模块解析**：项目使用了 `"moduleResolution": "NodeNext"`，这种模式遵循 Node.js 的 ES 模块解析规则，要求显式指定 `.js` 扩展名。

4. **运行时正确性**：编译后的代码在 Node.js 中运行时，实际加载的是 `.js` 文件，因此导入路径必须匹配运行时的实际文件。

**总结：** 虽然源文件是 `.ts`，但导入时必须写 `.js`，这是 TypeScript + ES 模块的标准做法。TypeScript 编译器会自动处理这种映射关系。
