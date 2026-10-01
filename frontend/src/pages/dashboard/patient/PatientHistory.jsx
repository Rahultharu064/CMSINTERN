import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks/authHooks';
import {
  FileText,
  Download,
  FilePlus,
  Activity,
  ShieldAlert,
  X,
  Upload,
  Loader2,
  Eye,
  Calendar,
  User,
  Tag,
} from 'lucide-react';
import {
  getPatientMedicalHistory,
  createMedicalRecord,
  getPrescriptionById,
  getReportById,
} from '../../../services/medicalRecordService';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const PatientHistory = () => {
  const reduxUser = useAppSelector((s) => s.auth?.user);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadSubmitting, setUploadSubmitting] = useState(false);
  const [vitalsSummary, setVitalsSummary] = useState({
    bloodPressure: null,
    heartRate: null,
    allergies: null,
  });

  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Lab Report',
    doctor: '',
    notes: '',
    file: null,
    recordDate: new Date().toISOString().split('T')[0],
  });

  const getUser = () => {
    if (reduxUser) return reduxUser;
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const getPatientId = (user) => {
    if (!user) return null;
    return user?.patientId || user?.profile?.patientId || user?.id;
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const user = getUser();
      const patientId = getPatientId(user);
      if (!patientId) {
        setRecords([]);
        return;
      }
      const data = await getPatientMedicalHistory(patientId, { limit: 100 });
      const list = Array.isArray(data?.records)
        ? data.records
        : Array.isArray(data)
        ? data
        : [];
      setRecords(list);

      let bp = null;
      let hr = null;
      let allergies = null;

      for (const r of list) {
        const v = r.vitals || r.data || {};
        if (!bp && (v.bloodPressure || v.bp || v.systolic)) {
          bp = v.bloodPressure || (v.systolic && v.diastolic ? `${v.systolic} / ${v.diastolic}` : null);
        }
        if (!hr && (v.heartRate || v.pulse)) {
          hr = v.heartRate || v.pulse;
        }
        if (!allergies && (r.allergies || v.allergies)) {
          allergies = r.allergies || v.allergies;
        }
        if (bp && hr && allergies) break;
      }

      const userAllergies = user?.allergies || user?.profile?.allergies;
      if (!allergies && userAllergies) {
        allergies = Array.isArray(userAllergies) ? userAllergies.join(', ') : userAllergies;
      }

      setVitalsSummary({ bloodPressure: bp, heartRate: hr, allergies });
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to load medical records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) {
      toast.error('Please enter a title for the record');
      return;
    }
    const user = getUser();
    const patientId = getPatientId(user);
    if (!patientId) {
      toast.error('Patient ID not found');
      return;
    }

    setUploadSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('title', uploadForm.title);
      payload.append('category', uploadForm.category);
      payload.append('patientId', patientId);
      if (uploadForm.doctor) payload.append('doctor', uploadForm.doctor);
      if (uploadForm.notes) payload.append('notes', uploadForm.notes);
      if (uploadForm.recordDate) payload.append('recordDate', uploadForm.recordDate);
      if (uploadForm.file) payload.append('file', uploadForm.file);

      if (uploadForm.file instanceof File) {
        await createMedicalRecordWithFile(payload);
      } else {
        await createMedicalRecord({
          title: uploadForm.title,
          category: uploadForm.category,
          patientId,
          doctor: uploadForm.doctor || undefined,
          notes: uploadForm.notes || undefined,
          recordDate: uploadForm.recordDate || undefined,
        });
      }

      toast.success('Medical record uploaded successfully');
      setShowUpload(false);
      setUploadForm({
        title: '',
        category: 'Lab Report',
        doctor: '',
        notes: '',
        file: null,
        recordDate: new Date().toISOString().split('T')[0],
      });
      fetchRecords();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to upload record');
    } finally {
      setUploadSubmitting(false);
    }
  };

  const createMedicalRecordWithFile = async (formData) => {
    try {
      return await createMedicalRecord(formData);
    } catch {
      const { createReport } = await import('../../../services/medicalRecordService');
      return await createReport({
        title: formData.get('title'),
        category: formData.get('category'),
        patientId: formData.get('patientId'),
        file: formData.get('file'),
        notes: formData.get('notes'),
      });
    }
  };

  const handleViewRecord = async (rec) => {
    try {
      if (rec.prescriptionId) {
        await getPrescriptionById(rec.prescriptionId);
        toast('Prescription loaded', { icon: '📄' });
        return;
      }
      if (rec.reportId) {
        await getReportById(rec.reportId);
        toast('Report loaded', { icon: '📊' });
        return;
      }
      if (rec.fileUrl || rec.downloadUrl || rec.url) {
        window.open(rec.fileUrl || rec.downloadUrl || rec.url, '_blank');
        return;
      }
      toast('No file attached to this record', { icon: 'ℹ️' });
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to open record');
    }
  };

  const handleDownload = (rec) => {
    const url = rec.fileUrl || rec.downloadUrl || rec.url;
    if (url) {
      window.open(url, '_blank');
    } else {
      toast('No file available for download', { icon: 'ℹ️' });
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    } catch {
      return String(d);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    const n = Number(bytes);
    if (!isFinite(n)) return String(bytes);
    if (n > 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
    if (n > 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${n} B`;
  };

  return (
    <div className="space-y-6">
      {/* Vitals Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
              <Activity className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-500">Blood Pressure</p>
              {vitalsSummary.bloodPressure ? (
                <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {vitalsSummary.bloodPressure}{' '}
                  <span className="text-xs font-normal text-slate-400">mmHg</span>
                </p>
              ) : (
                <p className="font-display text-lg font-bold text-slate-400">No vitals on file</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              <Activity className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-500">Heart Rate</p>
              {vitalsSummary.heartRate ? (
                <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {vitalsSummary.heartRate}{' '}
                  <span className="text-xs font-normal text-slate-400">BPM</span>
                </p>
              ) : (
                <p className="font-display text-lg font-bold text-slate-400">No vitals on file</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-500">Allergies</p>
              {vitalsSummary.allergies ? (
                <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {vitalsSummary.allergies}
                </p>
              ) : (
                <p className="font-display text-lg font-bold text-slate-400">None on file</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reports & Documents */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Medical Records & Reports
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {records.length} record{records.length !== 1 ? 's' : ''} on file
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-700"
          >
            <FilePlus className="h-4 w-4" /> Upload Document
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading medical records..." />
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 border-dashed bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <FileText className="h-16 w-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No medical records yet
            </p>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              Upload lab reports, prescriptions, radiology scans, and other documents to keep your medical history organized.
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              <FilePlus className="h-4 w-4" /> Upload Your First Document
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((rec) => {
              const hasFile = Boolean(rec.fileUrl || rec.downloadUrl || rec.url || rec.prescriptionId || rec.reportId);
              return (
                <div
                  key={rec.id || rec._id || rec.recordId || rec.title + rec.createdAt}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">
                        {rec.title || rec.name || 'Untitled Record'}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                        {rec.doctor?.fullName || rec.doctor?.name || rec.doctor ? (
                          <span className="inline-flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {rec.doctor?.fullName || rec.doctor?.name || rec.doctor}
                          </span>
                        ) : null}
                        {rec.category ? (
                          <span className="inline-flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {rec.category}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(rec.createdAt || rec.recordDate || rec.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-3 shrink-0">
                    {rec.fileSize || rec.size ? (
                      <span className="hidden text-xs text-slate-400 sm:inline">
                        {formatSize(rec.fileSize || rec.size)}
                      </span>
                    ) : null}
                    {hasFile && (
                      <button
                        onClick={() => handleViewRecord(rec)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-primary-600 hover:bg-primary-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(rec)}
                      disabled={!hasFile}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Upload Medical Record</h2>
                <p className="text-sm text-gray-500 mt-0.5">Add a new document to your history.</p>
              </div>
              <button
                onClick={() => setShowUpload(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  required
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="e.g. Blood Test Results - October 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                  >
                    <option>Lab Report</option>
                    <option>Blood Work</option>
                    <option>Radiology</option>
                    <option>Prescription</option>
                    <option>Imaging</option>
                    <option>Surgery</option>
                    <option>Discharge Summary</option>
                    <option>Consultation</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Record Date</label>
                  <input
                    type="date"
                    value={uploadForm.recordDate}
                    onChange={(e) => setUploadForm({ ...uploadForm, recordDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor / Provider</label>
                <input
                  type="text"
                  value={uploadForm.doctor}
                  onChange={(e) => setUploadForm({ ...uploadForm, doctor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="e.g. Dr. Ram Sharma"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File (optional)</label>
                <div className="mt-1">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-0.5">
                      {uploadForm.file ? uploadForm.file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-400">PDF, PNG, JPG up to 20MB</p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,application/pdf,.doc,.docx,.txt"
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })
                      }
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows="2"
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                  placeholder="Any notes about this record..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                />
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
              <button
                type="button"
                onClick={() => setShowUpload(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploadSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {uploadSubmitting ? 'Uploading...' : 'Save Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
