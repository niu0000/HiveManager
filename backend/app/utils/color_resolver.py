from typing import Tuple, Dict
from app.models.base import AssignmentStatus

class ColorResolver:
    # 定義済みカラーマップ (RGB)
    COLOR_MAP = {
        "reserved": (60, 130, 240),   # 青
        "confirmed": (34, 197, 94),   # 緑
        "cancelled": (239, 68, 68),   # 赤
        "empty": (255, 255, 255),     # 白
        "cleaning": (251, 191, 36),   # 黄
    }

    @staticmethod
    def rgb_to_hex(r: int, g: int, b: int) -> str:
        return "#{:02x}{:02x}{:02x}".format(int(r), int(g), int(b))

    @staticmethod
    def resolve_status(rgb: Tuple[int, int, int], tolerance: int = 30) -> str:
        r, g, b = rgb
        min_dist = float('inf')
        matched_status = "empty"

        for status, target_rgb in ColorResolver.COLOR_MAP.items():
            tr, tg, tb = target_rgb
            dist = ((r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2) ** 0.5
            if dist < min_dist:
                min_dist = dist
                matched_status = status
        
        if min_dist > tolerance * 1.732: # 最大誤差
            return "unknown"
        
        return matched_status