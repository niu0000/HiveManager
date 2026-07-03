import pandas as pd
from datetime import datetime, timedelta
from io import StringIO
from typing import List, Dict


def parse_neppan_csv(csv_content: str) -> List[Dict]:
    """
    ねっぱん CSV フォーマットをパースして予約データのリストを返す
    
    CSV フォーマット:
    申込日，泊数，予約サイト，部屋タイプ，商品プラン，室数，宿泊者氏名 (名)，宿泊者氏名 (姓)，電話番号，郵便番号，住所 1，メールアドレス，大人人数，食事，料金合計 (税サ込)，法人情報，大人単価，子供単価，幼児単価，大人会計額，子供会計額，幼児会計額，その他料金，その他会計額
    """
    # CSV をパース（全角カンマ区切り）
    lines = csv_content.strip().split('\n')
    if not lines:
        return []
    
    # ヘッダー行を取得（全角カンマで分割）
    header_line = lines[0]
    headers = [h.strip() for h in header_line.split('，')]
    
    reservations = []
    
    for line in lines[1:]:
        try:
            # 空行をスキップ
            if not line.strip():
                continue
            
            # データ行をパース（全角カンマで分割）
            values = [v.strip() if v else '' for v in line.split('，')]
            
            # ヘッダーと値を対応付ける
            row = dict(zip(headers, values))
            
            # 申込日をパース
            booking_date_str = row.get('申込日', '').strip()
            if not booking_date_str:
                continue
            booking_date = datetime.strptime(booking_date_str, '%Y/%m/%d')
            
            # 泊数からチェックイン・アウト日を計算
            nights = int(row.get('泊数', '1') or '1')
            check_in_date = booking_date
            check_out_date = check_in_date + timedelta(days=nights)
            
            # 国籍を抽出（住所から）
            address = row.get('住所 1', '') or ''
            nationality = None
            if 'ドイツ' in address:
                nationality = 'Germany'
            elif '東京都' in address or '日本' in address:
                nationality = 'Japan'
            elif '中国' in address:
                nationality = 'China'
            elif '韓国' in address:
                nationality = 'South Korea'
            
            reservation = {
                'booking_date': booking_date,
                'nights': nights,
                'check_in_date': check_in_date,
                'check_out_date': check_out_date,
                'booking_site': row.get('予約サイト', ''),
                'room_type_requested': row.get('部屋タイプ', ''),
                'plan_name': row.get('商品プラン', ''),
                'number_of_rooms': int(row.get('室数', '1') or '1'),
                'first_name': row.get('宿泊者氏名 (名)', ''),
                'last_name': row.get('宿泊者氏名 (姓)', ''),
                'phone': row.get('電話番号', ''),
                'postal_code': row.get('郵便番号', ''),
                'address': address,
                'email': row.get('メールアドレス', ''),
                'nationality': nationality,
                'adults': int(row.get('大人人数', '1') or '1'),
                'children': int(row.get('子供人数', '0') or '0'),
                'infants': int(row.get('幼児人数', '0') or '0'),
                'meal_plan': row.get('食事', ''),
                'total_amount': float(row.get('料金合計 (税サ込)', '0') or '0'),
                'corporate_info': row.get('法人情報', ''),
                'adult_unit_price': float(row.get('大人単価', '0') or '0'),
                'child_unit_price': float(row.get('子供単価', '0') or '0'),
                'infant_unit_price': float(row.get('幼児単価', '0') or '0'),
                'adult_charge': float(row.get('大人会計額', '0') or '0'),
                'child_charge': float(row.get('子供会計額', '0') or '0'),
                'infant_charge': float(row.get('幼児会計額', '0') or '0'),
                'other_charges': float(row.get('その他料金', '0') or '0'),
                'other_charge_total': float(row.get('その他会計額', '0') or '0'),
            }
            
            reservations.append(reservation)
            
        except Exception as e:
            # エラーが発生した行はスキップ（ログ出力すべき）
            print(f"Error parsing row: {e}")
            continue
    
    return reservations
