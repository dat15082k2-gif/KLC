const menuItems = [
  { id: 'viewDashboard', label: 'Dashboard', breadcrumb: 'Home / Dashboard' },
  { id: 'viewVisits', label: 'Ghé Thăm', breadcrumb: 'Home / Customer / Visit' },
  { id: 'viewCustomers', label: 'DS Khách hàng', breadcrumb: 'Home / Customer / List' }
];

const state = {
  customers: [
    { name: 'Anh Nguyễn Văn Chương', phone: '0906680629', channel: 'Kênh Tiki', result: 'Đã chốt bill', product: 'Massage Gối KLC' },
    { name: 'Chị Tư', phone: '0937938295', channel: 'Kênh Hoạt náo', result: 'Đã chốt bill', product: 'Massage Bụng KLC' }
  ]
};

function renderMenu() {
  const menu = document.getElementById('menu');
  menu.innerHTML = menuItems.map((m, i) => `<a href="#" data-view="${m.id}" class="${i===0 ? 'active':''}">${m.label}</a>`).join('');
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    switchView(a.dataset.view);
    menu.querySelectorAll('a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
  }));
}

function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  const item = menuItems.find(x => x.id === viewId);
  document.getElementById('pageTitle').textContent = item.label;
  document.getElementById('breadcrumb').textContent = item.breadcrumb;
}

function renderCustomers() {
  const tbody = document.getElementById('customersTable');
  tbody.innerHTML = state.customers.map((c, idx) => `
    <tr>
      <td>${idx + 1}</td><td>${c.name}</td><td>${c.phone}</td><td>${c.channel}</td><td>${c.result}</td><td>${c.product}</td>
    </tr>`).join('');

  const dashboardData = document.getElementById('dashboardData');
  const byChannel = state.customers.reduce((acc, c) => ((acc[c.channel] = (acc[c.channel] || 0) + 1), acc), {});
  const total = state.customers.length || 1;
  dashboardData.innerHTML = Object.entries(byChannel).map(([k, v]) =>
    `<tr><td>${k}</td><td>${v}</td><td>${((v/total)*100).toFixed(2)}%</td></tr>`
  ).join('');
}

function connectUi() {
  const modal = document.getElementById('customerModal');
  document.getElementById('openModal').onclick = () => modal.classList.add('show');
  document.getElementById('closeModal').onclick = () => modal.classList.remove('show');

  document.getElementById('customerForm').onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    state.customers.unshift({
      name: fd.get('name'),
      phone: fd.get('phone'),
      channel: 'Thêm thủ công',
      result: 'Chờ chăm sóc',
      product: 'Chưa xác định'
    });
    e.target.reset();
    modal.classList.remove('show');
    renderCustomers();
  };

  document.getElementById('visitForm').onsubmit = async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const row = Object.fromEntries(fd.entries());
    state.customers.unshift({
      name: row.customerName,
      phone: row.phone,
      channel: row.channel,
      result: row.result,
      product: row.product
    });
    renderCustomers();

    if (window.KLC_WEBAPP_URL) {
      await fetch(window.KLC_WEBAPP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'saveVisit', payload: row })
      });
    }

    e.target.reset();
    alert('Đã lưu ghé thăm.');
  };
}

renderMenu();
connectUi();
renderCustomers();
