# 更新云端服务 - Swagger 文档更新

## 📋 修改的文件

本次更新修改了以下文件：
- `src/routes/dogRoutes.js` - 添加了完整的 Swagger 注释（包括 PUT、POST、DELETE）
- `src/routes/swaggerRoutes.js` - 调整了 Swagger UI 配置（禁用过滤，展开所有端点）

## 🚀 部署步骤

### 方式一：使用 Git（推荐）

如果你在 GCP VM 上使用 Git 管理代码：

1. **在本地提交更改**
   ```bash
   cd user-service
   git add src/routes/dogRoutes.js src/routes/swaggerRoutes.js
   git commit -m "Update Swagger documentation for Dogs endpoints"
   git push
   ```

2. **SSH 到 GCP VM**
   ```bash
   # 使用 gcloud
   gcloud compute ssh <VM_NAME> --zone=<ZONE>
   
   # 或直接 SSH
   ssh user@34.9.57.25
   ```

3. **在 VM 上更新代码**
   ```bash
   cd /opt/pawpal/user-service
   git pull
   ```

4. **重启服务**
   ```bash
   # 如果使用 PM2
   pm2 restart user-service
   
   # 或如果使用 systemd
   sudo systemctl restart user-service
   ```

5. **验证更新**
   ```bash
   # 检查服务状态
   pm2 status
   # 或
   sudo systemctl status user-service
   
   # 测试 Swagger UI
   curl http://localhost:3001/api-docs/swagger.json | grep -i "put\|post" | head -5
   ```

### 方式二：直接上传文件（如果不用 Git）

1. **在本地打包修改的文件**
   ```bash
   # 在项目根目录
   cd user-service
   tar -czf swagger-update.tar.gz src/routes/dogRoutes.js src/routes/swaggerRoutes.js
   ```

2. **上传到 GCP VM**
   ```bash
   # 使用 gcloud
   gcloud compute scp swagger-update.tar.gz <VM_NAME>:/tmp/ --zone=<ZONE>
   
   # 或使用 SCP
   scp swagger-update.tar.gz user@34.9.57.25:/tmp/
   ```

3. **SSH 到 VM 并更新文件**
   ```bash
   ssh user@34.9.57.25
   cd /opt/pawpal/user-service
   
   # 备份原文件（可选）
   cp src/routes/dogRoutes.js src/routes/dogRoutes.js.backup
   cp src/routes/swaggerRoutes.js src/routes/swaggerRoutes.js.backup
   
   # 解压并覆盖
   tar -xzf /tmp/swagger-update.tar.gz
   ```

4. **重启服务**
   ```bash
   # 如果使用 PM2
   pm2 restart user-service
   
   # 或如果使用 systemd
   sudo systemctl restart user-service
   ```

5. **验证更新**
   ```bash
   # 检查服务日志
   pm2 logs user-service --lines 20
   # 或
   sudo journalctl -u user-service -n 20
   
   # 测试 Swagger
   curl http://localhost:3001/api-docs/swagger.json | grep -i "put\|post" | head -5
   ```

## ✅ 验证更新成功

1. **访问 Swagger UI**
   - 打开浏览器访问：`http://34.9.57.25:3001/api-docs/`
   - 检查 "Dogs" 标签下是否能看到：
     - ✅ `POST /api/dogs` - Create new dog
     - ✅ `PUT /api/dogs/{id}` - Update dog
     - ✅ `DELETE /api/dogs/{id}` - Delete dog

2. **检查 Swagger JSON**
   ```bash
   curl http://34.9.57.25:3001/api-docs/swagger.json | jq '.paths["/api/dogs/{id}"]'
   ```
   应该能看到 `get`, `put`, `delete` 三个方法。

3. **测试端点**
   ```bash
   # 测试健康检查
   curl http://34.9.57.25:3001/health
   
   # 测试 Swagger JSON
   curl http://34.9.57.25:3001/api-docs/swagger.json
   ```

## 🔧 故障排除

### 服务无法启动

1. **检查日志**
   ```bash
   pm2 logs user-service --err
   # 或
   sudo journalctl -u user-service -n 50
   ```

2. **检查语法错误**
   ```bash
   cd /opt/pawpal/user-service
   node -c src/routes/dogRoutes.js
   node -c src/routes/swaggerRoutes.js
   ```

3. **检查文件权限**
   ```bash
   ls -la src/routes/
   ```

### Swagger UI 没有更新

1. **清除浏览器缓存**
   - 硬刷新：`Ctrl + Shift + R` 或 `Ctrl + F5`

2. **检查服务是否重启**
   ```bash
   pm2 list
   # 或
   sudo systemctl status user-service
   ```

3. **检查文件是否正确更新**
   ```bash
   cd /opt/pawpal/user-service
   grep -n "filter: false" src/routes/swaggerRoutes.js
   grep -n "put:" src/routes/dogRoutes.js | head -3
   ```

## 📝 注意事项

- ⚠️ 更新前建议先备份原文件
- ⚠️ 确保 `.env` 文件配置正确
- ⚠️ 如果使用 PM2，确保 `pm2 save` 保存配置
- ⚠️ 更新后等待几秒钟让服务完全启动

## 🎯 快速更新命令（如果使用 Git）

```bash
# 在本地
cd user-service
git add src/routes/dogRoutes.js src/routes/swaggerRoutes.js
git commit -m "Update Swagger docs"
git push

# 在 GCP VM 上（SSH 后）
cd /opt/pawpal/user-service
git pull && pm2 restart user-service
```

