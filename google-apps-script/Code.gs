const SHEETS = {
  CUSTOMERS: 'Customers',
  VISITS: 'Visits',
  ORDERS: 'Orders',
  INSTALLMENT: 'Installments',
  DASHBOARD: 'Dashboard'
};

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, message: 'KLC API Ready' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    if (data.action === 'saveVisit') {
      saveVisit_(data.payload || {});
      return json_({ ok: true });
    }
    if (data.action === 'saveCustomer') {
      saveCustomer_(data.payload || {});
      return json_({ ok: true });
    }
    return json_({ ok: false, message: 'Unknown action' });
  } catch (error) {
    return json_({ ok: false, message: error.message });
  }
}

function setupSheets() {
  const ss = SpreadsheetApp.getActive();
  ensureSheet_(ss, SHEETS.CUSTOMERS, ['ID', 'Danh xưng', 'Tên KH', 'Điện thoại', 'Facebook', 'Địa chỉ', 'Ngày tạo']);
  ensureSheet_(ss, SHEETS.VISITS, ['ID', 'Tên KH', 'Điện thoại', 'Kênh liên hệ', 'Kết quả', 'Sản phẩm', 'Ghi chú', 'Ngày tạo']);
  ensureSheet_(ss, SHEETS.ORDERS, ['Mã đơn', 'Tên KH', 'SĐT', 'Sản phẩm', 'Thành tiền', 'Cọc', 'Trạng thái', 'Ngày tạo']);
  ensureSheet_(ss, SHEETS.INSTALLMENT, ['Mã đơn', 'Tên KH', 'SĐT', 'Số kỳ', 'Số tiền trả góp', 'Dư nợ', 'Ngày bắt đầu', 'Trạng thái']);
  ensureSheet_(ss, SHEETS.DASHBOARD, ['Ngày', 'Lượt liên hệ', 'Lượt ghé quầy', 'Lượt mua', 'Doanh thu']);
}

function saveVisit_(row) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEETS.VISITS);
  sh.appendRow([
    Utilities.getUuid(),
    row.customerName || '',
    row.phone || '',
    row.channel || '',
    row.result || '',
    row.product || '',
    row.note || '',
    new Date()
  ]);
  refreshDashboard_();
}

function saveCustomer_(row) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEETS.CUSTOMERS);
  sh.appendRow([
    Utilities.getUuid(),
    row.title || '',
    row.name || '',
    row.phone || '',
    row.facebook || '',
    row.address || '',
    new Date()
  ]);
}

function refreshDashboard_() {
  const ss = SpreadsheetApp.getActive();
  const visitSh = ss.getSheetByName(SHEETS.VISITS);
  const dashSh = ss.getSheetByName(SHEETS.DASHBOARD);
  const values = visitSh.getDataRange().getValues();
  if (values.length < 2) return;

  const todayKey = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const rows = values.slice(1).filter(r => Utilities.formatDate(new Date(r[7]), Session.getScriptTimeZone(), 'yyyy-MM-dd') === todayKey);
  const contacts = rows.length;
  const bought = rows.filter(r => r[4] === 'Đã chốt bill').length;
  dashSh.appendRow([new Date(), contacts, Math.round(contacts / 2), bought, 0]);
}

function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  sh.clear();
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  sh.setFrozenRows(1);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
