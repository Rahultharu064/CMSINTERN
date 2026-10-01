import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBill, getBillSummary, generateBill } from '../../../services/billingService';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import PaymentModal from '../../../components/ui/PaymentModal';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Printer,
  CreditCard,
  CheckCircle2,
  Smartphone,
  FileText,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Loader2,
  X,
  Trash2,
} from 'lucide-react';

const StatusPill = ({ status }) => {
  const styles = {
    PAID: 'bg-green-100 text-green-800',
    UNPAID: 'bg-red-100 text-red-800',
    PARTIAL: 'bg-yellow-100 text-yellow-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${styles[status] || styles.UNPAID}`}>
      {status}
    </span>
  );
};

const StaffBilling = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==================== BILL DETAIL STATE ====================
  const [bill, setBill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // ==================== BILL LIST STATE ====================
  const [bills, setBills] = useState([]);
  const [billsLoading, setBillsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateBill, setShowCreateBill] = useState(false);

  // ==================== CREATE BILL FORM STATE ====================
  const [createForm, setCreateForm] = useState({
    patientName: '',
    patientEmail: '',
    patientId: '',
    discount: 0,
    tax: 0,
    notes: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // ==================== FETCH BILL DETAIL ====================
  const fetchBill = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBill(id);
      setBill(data);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch bill';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== FETCH BILL LIST ====================
  const fetchBillsList = async () => {
    setBillsLoading(true);
    try {
      const data = await getBillSummary({ limit: 50 });
      setBills(Array.isArray(data?.bills) ? data.bills : Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to load bills');
    } finally {
      setBillsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      const timeoutId = window.setTimeout(fetchBill, 0);
      return () => window.clearTimeout(timeoutId);
    } else {
      fetchBillsList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ==================== CREATE BILL HANDLERS ====================
  const addBillItem = () => {
    setCreateForm((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }],
    }));
  };

  const removeBillItem = (idx) => {
    setCreateForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const updateBillItem = (idx, field, value) => {
    setCreateForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    }));
  };

  const computeCreateTotals = () => {
    const subtotal = createForm.items.reduce(
      (s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
      0
    );
    const discount = Number(createForm.discount) || 0;
    const tax = Number(createForm.tax) || 0;
    const total = subtotal - discount + tax;
    return { subtotal, discount, tax, total };
  };

  const handleCreateBill = async (e) => {
    e.preventDefault();
    const { subtotal, discount, tax, total } = computeCreateTotals();
    if (!createForm.items.some((it) => it.description && it.quantity > 0 && it.unitPrice > 0)) {
      toast.error('Please add at least one valid bill item');
      return;
    }
    setCreateSubmitting(true);
    try {
      const payload = {
        patientName: createForm.patientName,
        patientEmail: createForm.patientEmail,
        patientId: createForm.patientId || undefined,
        items: createForm.items
          .filter((it) => it.description && it.quantity > 0 && it.unitPrice > 0)
          .map((it) => ({
            description: it.description,
            quantity: Number(it.quantity),
            unitPrice: Number(it.unitPrice),
          })),
        subtotal,
        discount,
        tax,
        totalAmount: total,
        notes: createForm.notes,
      };
      const created = await generateBill(payload);
      toast.success('Bill created successfully');
      setShowCreateBill(false);
      setCreateForm({
        patientName: '',
        patientEmail: '',
        patientId: '',
        discount: 0,
        tax: 0,
        notes: '',
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
      });
      if (created?.id) {
        navigate(`/staff/billing/${created.id}`);
      } else {
        fetchBillsList();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create bill');
    } finally {
      setCreateSubmitting(false);
    }
  };

  // ==================== FILTER BILLS ====================
  const filteredBills = bills.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const invoiceNum = b.invoiceNumber?.toLowerCase() || '';
      const patientName = b.patient?.user?.fullName?.toLowerCase() || b.patientName?.toLowerCase() || '';
      const patientEmail = b.patient?.user?.email?.toLowerCase() || b.patientEmail?.toLowerCase() || '';
      if (!invoiceNum.includes(q) && !patientName.includes(q) && !patientEmail.includes(q)) return false;
    }
    return true;
  });

  // ==================== RENDER LIST VIEW ====================
  if (!id) {
    const totals = computeCreateTotals();
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
            <p className="text-gray-600 mt-1">Manage invoices, payments, and billing records.</p>
          </div>
          <button
            onClick={() => setShowCreateBill(true)}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium text-sm"
          >
            <Plus size={16} /> Create Bill
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search invoice, patient name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
              <option value="PARTIAL">Partial</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button
              onClick={fetchBillsList}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              title="Refresh"
            >
              <Download size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {billsLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading bills..." />
          </div>
        ) : filteredBills.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-semibold text-gray-900 mb-2">No bills found</p>
            <p className="text-sm text-gray-600 mb-6">
              {bills.length === 0 ? 'Get started by creating your first bill.' : 'Try adjusting your search or filters.'}
            </p>
            <button
              onClick={() => bills.length === 0 ? setShowCreateBill(true) : (setSearch(''), setStatusFilter('ALL'))}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium text-sm"
            >
              {bills.length === 0 ? <><Plus size={16} /> Create Bill</> : 'Clear Filters'}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBills.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-mono text-sm font-semibold text-gray-900">
                          {b.invoiceNumber || `#${b.billNumber || b.id?.slice(0, 8)}`}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium text-gray-900">
                          {b.patient?.user?.fullName || b.patientName || 'Unknown Patient'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {b.patient?.user?.email || b.patientEmail || ''}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {b.generatedAt ? new Date(b.generatedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                        Rs. {(b.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusPill status={b.status} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/staff/billing/${b.id}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100"
                          >
                            <Eye size={14} /> View
                          </button>
                          {b.status !== 'PAID' && b.status !== 'CANCELLED' && (
                            <button
                              onClick={() => navigate(`/staff/billing/${b.id}`)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                            >
                              <CreditCard size={14} /> Pay
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showCreateBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create New Bill</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Fill in the details to generate a new invoice.</p>
                </div>
                <button
                  onClick={() => setShowCreateBill(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateBill} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                    <input
                      required
                      type="text"
                      value={createForm.patientName}
                      onChange={(e) => setCreateForm({ ...createForm, patientName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Email</label>
                    <input
                      type="email"
                      value={createForm.patientEmail}
                      onChange={(e) => setCreateForm({ ...createForm, patientEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID (optional)</label>
                    <input
                      type="text"
                      value={createForm.patientId}
                      onChange={(e) => setCreateForm({ ...createForm, patientId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      placeholder="PAT-1234"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Bill Items *</label>
                    <button
                      type="button"
                      onClick={addBillItem}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {createForm.items.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6">
                          <input
                            type="text"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateBillItem(idx, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            min="1"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => updateBillItem(idx, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Unit Price"
                            value={item.unitPrice}
                            onChange={(e) => updateBillItem(idx, 'unitPrice', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                          />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          {createForm.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBillItem(idx)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (Rs.)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={createForm.discount}
                      onChange={(e) => setCreateForm({ ...createForm, discount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax (Rs.)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={createForm.tax}
                      onChange={(e) => setCreateForm({ ...createForm, tax: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-1 flex flex-col justify-end">
                    <div className="text-sm space-y-1 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between text-gray-600"><span>Subtotal:</span><span>Rs. {totals.subtotal.toLocaleString()}</span></div>
                      {totals.discount > 0 && (
                        <div className="flex justify-between text-red-600"><span>Discount:</span><span>-Rs. {totals.discount.toLocaleString()}</span></div>
                      )}
                      {totals.tax > 0 && (
                        <div className="flex justify-between text-gray-600"><span>Tax:</span><span>Rs. {totals.tax.toLocaleString()}</span></div>
                      )}
                      <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200 mt-1">
                        <span>Total:</span><span>Rs. {totals.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows="2"
                    value={createForm.notes}
                    onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                    placeholder="Any additional notes about this bill..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                  />
                </div>
              </form>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateBill(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBill}
                  disabled={createSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {createSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  {createSubmitting ? 'Creating...' : 'Create Bill'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== RENDER DETAIL LOADING ====================
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" text="Loading bill..." />
      </div>
    );
  }

  // ==================== RENDER DETAIL ERROR ====================
  if (error || !bill) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/staff/billing')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bill Details</h1>
            <p className="text-gray-600 mt-1">Bill not found</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <p className="text-lg font-semibold mb-2">{error || 'Bill not found'}</p>
          <p className="text-sm text-red-600 mb-4">The requested bill may have been deleted or the ID is incorrect.</p>
          <button
            onClick={() => navigate('/staff/billing')}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 font-medium text-sm"
          >
            <ArrowLeft size={16} /> Back to Billing List
          </button>
        </div>
      </div>
    );
  }

  const totalPaid = bill.payments?.reduce((s, p) => s + p.amount, 0) || 0;
  const remaining = bill.totalAmount - totalPaid;
  const canPay = bill.status !== 'PAID' && bill.status !== 'CANCELLED' && remaining > 0;

  // ==================== RENDER DETAIL VIEW ====================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/staff/billing')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bill Details</h1>
            <p className="text-gray-600 mt-1 font-mono">{bill.invoiceNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            <Printer size={16} /> Print
          </button>
          {canPay && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <CreditCard size={16} /> Process Payment
            </button>
          )}
        </div>
      </div>

      {/* Payment Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500 mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900">
            Rs. {bill.totalAmount?.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500 mb-1">Paid</p>
          <p className="text-2xl font-bold text-green-600">
            Rs. {totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500 mb-1">Remaining</p>
          <p className="text-2xl font-bold text-red-600">
            Rs. {remaining.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Invoice Card */}
      <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none" id="invoice">
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Healthcare System</h2>
            <p className="text-gray-600 text-sm mt-1">123 Medical Street</p>
            <p className="text-gray-600 text-sm">Kathmandu, Nepal</p>
            <p className="text-gray-600 text-sm">+977 9800000000</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold text-gray-900">INVOICE</h3>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Invoice #:</span> {bill.invoiceNumber}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Bill #:</span> {bill.billNumber}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Date:</span>{' '}
              {new Date(bill.generatedAt).toLocaleDateString()}
            </p>
            <span
              className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                bill.status === 'PAID'
                  ? 'bg-green-100 text-green-800'
                  : bill.status === 'UNPAID'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {bill.status}
            </span>
          </div>
        </div>

        {/* Patient Info */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">BILL TO:</h4>
          <p className="font-medium text-gray-900">
            {bill.patient?.user?.fullName || bill.patientName || 'N/A'}
          </p>
          <p className="text-gray-600 text-sm">{bill.patient?.user?.email || bill.patientEmail}</p>
          <p className="text-gray-600 text-sm">{bill.patient?.user?.phone}</p>
          {bill.patient?.address && (
            <p className="text-gray-600 text-sm">{bill.patient.address}</p>
          )}
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Description
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">
                Qty
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                Unit Price
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bill.items?.map((item, i) => (
              <tr key={i}>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {item.description}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 text-center">
                  {item.quantity}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 text-right">
                  Rs. {item.unitPrice}
                </td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                  Rs. {item.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">Rs. {bill.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">Rs. {bill.tax}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-red-600">
                  -Rs. {bill.discount}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-lg">
                Rs. {bill.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment History */}
        {bill.payments?.length > 0 && (
          <div className="pt-6 border-t">
            <h4 className="font-semibold text-gray-900 mb-4">Payment History</h4>
            <div className="space-y-3">
              {bill.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      {payment.method === 'ONLINE' ? (
                        <Smartphone className="text-green-600" size={16} />
                      ) : (
                        <CheckCircle2 className="text-green-600" size={16} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Rs. {payment.amount?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {payment.method} •{' '}
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-green-600">
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Payment Summary */}
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Paid:</span>
                <span className="font-medium text-green-600">
                  Rs. {totalPaid.toLocaleString()}
                </span>
              </div>
              {remaining > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium text-red-600">
                    Rs. {remaining.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bill={bill}
        onSuccess={fetchBill}
      />
    </div>
  );
};

export default StaffBilling;
