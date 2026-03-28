import comfy.sd
import folder_paths
import comfy.utils

class BasicExpansionHub:
    """
    サイドパネルUIと連携するためのハブノード。
    UIからの操作（JS経由のウィジェット更新）を受け取り、モデルのロードやLoRAの適用を行います。
    """
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "ckpt_name": (folder_paths.get_filename_list("checkpoints"), ),
                "lora_name": (["None"] + folder_paths.get_filename_list("loras"), ),
                "lora_strength_model": ("FLOAT", {"default": 1.0, "min": -10.0, "max": 10.0, "step": 0.01}),
                "lora_strength_clip": ("FLOAT", {"default": 1.0, "min": -10.0, "max": 10.0, "step": 0.01}),
            }
        }

    RETURN_TYPES = ("MODEL", "CLIP", "VAE")
    FUNCTION = "apply"
    CATEGORY = "BasicExpansion"

    def apply(self, ckpt_name, lora_name, lora_strength_model, lora_strength_clip):
        # 1. ターゲットのチェックポイントをロード
        ckpt_path = folder_paths.get_full_path_or_raise("checkpoints", ckpt_name)
        out = comfy.sd.load_checkpoint_guess_config(ckpt_path, output_vae=True, output_clip=True, embedding_directory=folder_paths.get_folder_paths("embeddings"))
        model, clip, vae = out[:3]

        # 2. LoRAが指定されている場合は適用
        if lora_name != "None" and (lora_strength_model != 0 or lora_strength_clip != 0):
            lora_path = folder_paths.get_full_path_or_raise("loras", lora_name)
            lora = comfy.utils.load_torch_file(lora_path, safe_load=True)
            model, clip = comfy.sd.load_lora_for_models(model, clip, lora, lora_strength_model, lora_strength_clip)

        return (model, clip, vae)
