import os
import json
import yaml
import folder_paths
from server import PromptServer
from aiohttp import web

# 拡張機能のディレクトリを取得
EXTENSION_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROMPTS_DIR = os.path.join(EXTENSION_DIR, "prompts")

def register_routes():
    # プロンプト保存用ディレクトリの作成
    if not os.path.exists(PROMPTS_DIR):
        os.makedirs(PROMPTS_DIR)

    routes = PromptServer.instance.routes

    @routes.get("/basic-expansion/prompts/list")
    async def list_prompts(request):
        files = [f for f in os.listdir(PROMPTS_DIR) if f.endswith(".yaml") or f.endswith(".yml")]
        return web.json_response(files)

    @routes.post("/basic-expansion/prompts/save")
    async def save_prompt(request):
        try:
            data = await request.json()
            filename = data.get("filename", "default.yaml")
            content = data.get("content", "")

            # セキュリティチェック: ディレクトリトラバーサル防止
            filename = os.path.basename(filename)
            if not (filename.endswith(".yaml") or filename.endswith(".yml")):
                filename += ".yaml"
            
            filepath = os.path.join(PROMPTS_DIR, filename)
            
            # YAMLとして保存
            with open(filepath, "w", encoding="utf-8") as f:
                yaml.dump(content, f, allow_unicode=True)
            
            return web.json_response({"status": "success", "message": f"Saved to {filename}"})
        except Exception as e:
            return web.json_response({"status": "error", "message": str(e)}, status=500)

    @routes.get("/basic-expansion/prompts/load")
    async def load_prompt(request):
        try:
            filename = request.query.get("filename", "default.yaml")
            filename = os.path.basename(filename)
            filepath = os.path.join(PROMPTS_DIR, filename)

            if not os.path.exists(filepath):
                return web.json_response({"status": "error", "message": "File not found"}, status=404)

            with open(filepath, "r", encoding="utf-8") as f:
                content = yaml.safe_load(f)
            
            return web.json_response({"content": content})
        except Exception as e:
            return web.json_response({"status": "error", "message": str(e)}, status=500)

    @routes.get("/basic-expansion/images/list")
    async def list_images(request):
        try:
            output_dir = folder_paths.get_output_directory()
            if not os.path.exists(output_dir):
                return web.json_response([])
            
            # 画像ファイルのリストを取得（新しい順）
            files = [f for f in os.listdir(output_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
            files.sort(key=lambda x: os.path.getmtime(os.path.join(output_dir, x)), reverse=True)
            
            # プレビュー用のURLを含めて返す
            images = []
            for f in files:
                images.append({
                    "filename": f,
                    "url": f"/view?filename={encodeURIComponent(f)}&type=output"
                })
            
            return web.json_response(images)
        except Exception as e:
            return web.json_response({"status": "error", "message": str(e)}, status=500)

from urllib.parse import quote as encodeURIComponent
