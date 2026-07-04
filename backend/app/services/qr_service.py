import qrcode
from io import BytesIO
from typing import Optional
from fastapi import HTTPException

class QRCodeService:
    """QR コード生成サービス"""
    
    @staticmethod
    def generate_bed_qr(
        room_name: str,
        bed_number: str,
        check_in: str,
        check_out: str,
        guest_name: Optional[str] = None,
        size: int = 10
    ) -> BytesIO:
        """
        ベッド情報 QR コードを生成
        
        Args:
            room_name: 部屋名
            bed_number: ベッド番号
            check_in: チェックイン日 (YYYY-MM-DD)
            check_out: チェックアウト日 (YYYY-MM-DD)
            guest_name: ゲスト名（オプション）
            size: QR コードのサイズ（ボックスサイズ）
            
        Returns:
            BytesIO: PNG 画像データ
        """
        # QR コードデータ作成
        data = {
            "room": room_name,
            "bed": bed_number,
            "check_in": check_in,
            "check_out": check_out,
        }
        if guest_name:
            data["guest"] = guest_name
        
        # JSON 文字列としてエンコード
        import json
        qr_data = json.dumps(data, ensure_ascii=False)
        
        # QR コード生成
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=size,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        # 画像作成
        img = qr.make_image(fill_color="black", back_color="white")
        
        # BytesIO に保存
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        
        return buffer
    
    @staticmethod
    def generate_recommendation_qr(
        recommendation_id: int,
        name: str,
        base_url: str = "https://dormitory-manager.example.com"
    ) -> BytesIO:
        """
        おすすめ情報 QR コードを生成
        
        Args:
            recommendation_id: おすすめ情報 ID
            name: 施設名
            base_url: ベース URL
            
        Returns:
            BytesIO: PNG 画像データ
        """
        # URL 生成
        url = f"{base_url}/recommendations/{recommendation_id}"
        
        # QR コード生成
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)
        
        # 画像作成
        img = qr.make_image(fill_color="black", back_color="white")
        
        # BytesIO に保存
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        
        return buffer
    
    @staticmethod
    def generate_custom_qr(
        content: str,
        size: int = 10,
        error_correction: str = "M"
    ) -> BytesIO:
        """
        カスタム QR コードを生成
        
        Args:
            content: QR コードにエンコードする内容
            size: ボックスサイズ
            error_correction: エラー訂正レベル (L, M, Q, H)
            
        Returns:
            BytesIO: PNG 画像データ
        """
        # エラー訂正レベルのマッピング
        correction_map = {
            "L": qrcode.constants.ERROR_CORRECT_L,
            "M": qrcode.constants.ERROR_CORRECT_M,
            "Q": qrcode.constants.ERROR_CORRECT_Q,
            "H": qrcode.constants.ERROR_CORRECT_H,
        }
        
        ec_level = correction_map.get(error_correction.upper(), qrcode.constants.ERROR_CORRECT_M)
        
        # QR コード生成
        qr = qrcode.QRCode(
            version=1,
            error_correction=ec_level,
            box_size=size,
            border=4,
        )
        qr.add_data(content)
        qr.make(fit=True)
        
        # 画像作成
        img = qr.make_image(fill_color="black", back_color="white")
        
        # BytesIO に保存
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        
        return buffer
