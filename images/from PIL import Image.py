from PIL import Image
import os

# 使用 r 前缀处理 Windows 路径，避免转义字符报错
directory = r"C:\Users\qwu\OneDrive - CUNY\Desktop\CB\CheaperBrothers-main\images"

def convert_images_to_webp(folder_path):
    # 遍历文件夹中的所有文件
    for filename in os.listdir(folder_path):
        # 筛选出 jpg, jpeg, png 格式的图片
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            original_path = os.path.join(folder_path, filename)
            # 剥离原后缀，换成 .webp
            new_filename = os.path.splitext(filename)[0] + ".webp"
            webp_path = os.path.join(folder_path, new_filename)
            
            # 如果该 webp 文件已经存在，则跳过
            if os.path.exists(webp_path):
                print(f"⏭️ 已跳过 (已存在): {new_filename}")
                continue

            try:
                # 打开并读取图片
                with Image.open(original_path) as img:
                    # 统一转换为 RGB 模式，防止部分带有透明通道的 PNG 转换时报错
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    
                    # 导出为 WEBP，quality=80 是肉眼无损且体积最小的黄金比例
                    img.save(webp_path, "WEBP", quality=80)
                
                print(f"✅ 成功转换: {filename} -> {new_filename}")
                
                # 可选操作：如果你想在转换后自动删除原图以节省空间，取消下方代码的注释
                # os.remove(original_path) 
                
            except Exception as e:
                print(f"❌ 转换 {filename} 时出错: {e}")

    print("🎉 批量转换任务完成！")

# 执行函数
convert_images_to_webp(directory)
