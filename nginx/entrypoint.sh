#!/bin/sh
set -e

# 定义模板路径
TEMPLATE="/etc/nginx/templates/default.conf.template"
# 定义临时文件路径（位于容器内部可写层）
TEMP_FILE="/tmp/nginx_default.conf.template.tmp"

# 检查模板文件是否存在
if [ ! -f "$TEMPLATE" ]; then
    echo "[nginx] Error: Template file $TEMPLATE not found."
    exit 1
fi

# 根据环境处理内容并写入临时文件
if [ "$NODE_ENV" != "production" ]; then
    echo "[nginx] Environment is '$NODE_ENV'. Removing API block..."
    # 移除 API 块并将结果输出到临时文件
    sed '/##__API_BLOCK_START__/,/##__API_BLOCK_END__/d' "$TEMPLATE" > "$TEMP_FILE"
else
    echo "[nginx] Environment is production. Keeping API block..."
    # 仅移除标记行并将结果输出到临时文件
    sed '/##__API_BLOCK_START__/d;/##__API_BLOCK_END__/d' "$TEMPLATE" > "$TEMP_FILE"
fi

# 关键：使用 cat + 重定向写回原模板文件
# 这样操作不会改变文件的 inode，避开了 Docker "Resource busy" 的限制
cat "$TEMP_FILE" > "$TEMPLATE"

# 删除临时文件
rm -f "$TEMP_FILE"

echo "[nginx] Template processed successfully."

# 执行 Nginx 官方镜像的原有入口脚本
exec /docker-entrypoint.sh nginx -g 'daemon off;'
