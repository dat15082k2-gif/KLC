# KLC Clone + Google Sheets

Bộ code này giúp bạn dựng nhanh giao diện giống hệ thống KLC (sidebar, dashboard, DS khách hàng, form ghé thăm) và kết nối lưu dữ liệu vào Google Sheets bằng Apps Script.

## 1) Chạy giao diện web

```bash
cd web
python3 -m http.server 4173
```

Mở: `http://localhost:4173`

## 2) Tạo Google Sheets đúng cấu trúc (tự động)

1. Mở Google Sheets của bạn.
2. Extensions → Apps Script.
3. Dán file `google-apps-script/Code.gs` vào `Code.gs`.
4. Dán file `google-apps-script/appsscript.json` vào `appsscript.json`.
5. Chạy hàm `setupSheets()` **1 lần** để tạo đầy đủ các sheet:
   - `Customers`
   - `Visits`
   - `Orders`
   - `Installments`
   - `Dashboard`

## 3) Deploy API Apps Script

1. Trong Apps Script: Deploy → New deployment.
2. Type: **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone with the link**.
5. Deploy và copy URL dạng `https://script.google.com/macros/s/.../exec`.

## 4) Nối web với Apps Script

Mở `web/app.js`, thêm đầu file:

```js
window.KLC_WEBAPP_URL = 'DAN_LINK_DEPLOY_WEB_APP_CUA_BAN';
```

Khi bấm **Lưu Ghé thăm**, dữ liệu sẽ append vào sheet `Visits`.

## 5) Mapping dữ liệu theo màn hình bạn gửi

- Dashboard: lấy từ `Dashboard` (hàm `refreshDashboard_` cập nhật tự động khi có Visit mới).
- DS Khách hàng: đọc từ `Customers`.
- Ghé thăm: ghi vào `Visits`.
- Đơn hàng: dùng `Orders`.
- Đơn trả góp: dùng `Installments`.

## 6) Gợi ý để giống 100% production

- Tách route: `/dashboard`, `/customer/list`, `/customer/visit`, `/order/list`, `/order/installment`.
- Thêm login bằng JWT hoặc Firebase Auth.
- Đổi nguồn dữ liệu từ append thẳng Sheets sang API có validation.
- Dùng chart (ApexCharts) cho phần biểu đồ nguồn khách.

## 7) Lưu ý

- Mình đã dựng bản hoàn chỉnh để bạn copy/paste chạy nhanh ngay.
- Nếu bạn muốn, bước tiếp theo mình có thể build tiếp bản đa trang + CRUD đầy đủ (sửa/xoá/tìm kiếm + phân quyền nhân viên) theo đúng 100% luồng nghiệp vụ hiện tại.
