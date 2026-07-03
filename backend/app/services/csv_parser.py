import pandas as pd
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.base import Reservation
import re

def parse_neppan_csv(file_path: str, db: Session):
    try:
        # 全角カンマ区切り対応のため、一旦テキストとして読み込んで置換
        with open(file_path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
        
        # 全角カンマを半角カンマに置換
        content = content.replace('，', ',')
        
        # 改行コード統一
        content = content.replace('\r\n', '\n').replace('\r', '\n')
        
        lines = content.strip().split('\n')
        if len(lines) < 2:
            return []
            
        header = lines[0].split(',')
        data_lines = [line for line in lines[1:] if line.strip()]
        
        # DataFrame 作成
        df = pd.DataFrame([line.split(',') for line in data_lines], columns=header)
        
        reservations = []
        for _, row in df.iterrows():
            try:
                # 日付パース
                booking_date = None
                if pd.notna(row.get('申込日')):
                    try:
                        booking_date = datetime.strptime(str(row['申込日']).split('.')[0], '%Y/%m/%d')
                    except:
                        pass
                
                check_in_date = None
                if booking_date:
                    check_in_date = booking_date # 簡易的に申込日=チェックインとする（実際は計算必要）
                    check_out_date = check_in_date + timedelta(days=int(row.get('泊数', 1)))
                else:
                    check_out_date = None

                # 国籍判定
                address = str(row.get('住所 1', ''))
                nationality = 'JP'
                if 'ドイツ' in address: nationality = 'DE'
                elif '中国' in address: nationality = 'CN'
                elif '韓国' in address: nationality = 'KR'
                elif '日本' in address: nationality = 'JP'

                res = Reservation(
                    booking_date=booking_date,
                    nights=int(row.get('泊数', 1)),
                    site=str(row.get('予約サイト', '')),
                    room_type_request=str(row.get('部屋タイプ', '')),
                    plan=str(row.get('商品プラン', '')),
                    rooms_count=int(row.get('室数', 1)),
                    first_name=str(row.get('宿泊者氏名 (名)', '')),
                    last_name=str(row.get('宿泊者氏名 (姓)', '')),
                    phone=str(row.get('電話番号', '')),
                    postal_code=str(row.get('郵便番号', '')),
                    address=address,
                    email=str(row.get('メールアドレス', '')),
                    adults=int(row.get('大人人数', 1)),
                    meal=str(row.get('食事', '')),
                    total_price=float(str(row.get('料金合計 (税サ込)', 0)).replace(',', '')),
                    company=str(row.get('法人情報', '')),
                    adult_price=float(str(row.get('大人単価', 0)).replace(',', '')),
                    child_price=float(str(row.get('子供単価', 0)).replace(',', '')),
                    infant_price=float(str(row.get('幼児単価', 0)).replace(',', '')),
                    adult_total=float(str(row.get('大人会計額', 0)).replace(',', '')),
                    child_total=float(str(row.get('子供会計額', 0)).replace(',', '')),
                    infant_total=float(str(row.get('幼児会計額', 0)).replace(',', '')),
                    other_fee=float(str(row.get('その他料金', 0)).replace(',', '')),
                    other_total=float(str(row.get('その他会計額', 0)).replace(',', '')),
                    check_in_date=check_in_date,
                    check_out_date=check_out_date,
                    nationality=nationality,
                    gender='M' # CSV に性別がないためデフォルト
                )
                reservations.append(res)
            except Exception as e:
                print(f"Row parse error: {e}")
                continue
                
        return reservations
    except Exception as e:
        raise Exception(f"CSV Parse Error: {str(e)}")