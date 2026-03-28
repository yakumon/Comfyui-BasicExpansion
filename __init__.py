"""
ComfyUI Basic Expansion
A custom node extension for providing an enhanced side-panel UI and a Hub node to easily sync parameters (Lora, Checkpoint, Prompts, Images).
"""

from .py.hub_node import BasicExpansionHub
from .py import api

# APIルートの登録
api.register_routes()

# ComfyUIがノードとして認識するためのマッピング
NODE_CLASS_MAPPINGS = {
    "BasicExpansionHub": BasicExpansionHub
}

# UI表示用のノード名マッピング
NODE_DISPLAY_NAME_MAPPINGS = {
    "BasicExpansionHub": "BasicExpansion Hub Node"
}

# フロントエンド用JavaScriptファイルのディレクトリ
# ComfyUIはこのディレクトリ内の .js ファイルを自動的に読み込みます。
WEB_DIRECTORY = "./js"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
