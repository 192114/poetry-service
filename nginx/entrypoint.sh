#!/bin/sh
set -e

# 定义模板路径
TEMPLATE="/etc/nginx/templates/default.conf.template"

# 检查模板文件是否存在
if [ ! -f "$TEMPLATE" ]; then
    echo "[nginx] Error: Template file $TEMPLATE not found."
    exit 1
fi

# 根据环境处理 API 块
if [ "$NODE_ENV" != "production" ]; then
    echo "[nginx] Environment is '$NODE_ENV'. Removing API block from template..."
    # 删除起始标记、结束标记以及它们之间的所有内容
    sed -i '/##__API_BLOCK_START__/,/##__API_BLOCK_END__/d' "$TEMPLATE"
else
    echo "[nginx] Environment is production. Keeping API block..."
    # 仅删除标记行，保留中间的内容
    sed -i '/##__API_BLOCK_START__/d;/##__API_BLOCK_END__/d' "$TEMPLATE"
fi

# 执行 Nginx 官方镜像的原有入口脚本
# 它会自动处理 /etc/nginx/templates/ 目录下的 envsubst 替换
exec /docker-entrypoint.sh nginx -g 'daemon off;'