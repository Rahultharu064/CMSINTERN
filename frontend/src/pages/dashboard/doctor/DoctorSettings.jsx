import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  User,
  Upload,
  ShieldCheck,
  Save,
  KeyRound,
  Stethoscope,
  BadgeCheck,
  Clock3,
  Plus,
  X,
  UploadCloud,
  Trash2,
} from 'lucide-react';
import SectionCard from '../../../components/sections/SectionCard';
import StatCard from '../../../components/sections/StatCard';
import { getMyDoctorProfile, updateDoctor } from '../../../services/doctorService.js';
import { changePassword, getProfile, updateProfile, uploadAvatar } from '../../../services/authServices.js';
import { getAllDepartments } from '../../../services/departmentService.js';
import { useAppSelector } from '../../../hooks/authHooks.js';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const appendField = (formData, key, value) => {
  if (value === undefined || value === null || value === '') return;
  formData.append(key, typeof value === 'object' && !(value instanceof File) ? JSON.stringify(value) : value);
};

const toFormData = (data, files = {}) => {
  const fd = new FormData();
  Object.entries(data || {}).forEach(([k, v]) => appendField(fd, k, v));
  if (files.profilePicture) fd.append('profilePicture', files.profilePicture);
  (files.certificates || []).forEach((f) => fd.append('certificates', f));
  return fd;
};

const defaultSlot = () => ({ id: crypto.randomUUID(), open: '09:00', close: '17:00', breakStart: '13:00', breakEnd: '14:00', on: true });

const DoctorSettings = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    specialization: '',
    licenseNumber: '',
    qualifications: '',
    experience: '',
    hospital: '',
    department: '',
    consultationFee: '',
    bio: '',
    gender: '',
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  const [departments, setDepartments] = useState([]);

  // Password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Availability
  const [slots, setSlots] = useState(() => {
    const base = {};
    DAYS.forEach((d) => {
      const weekend = d === 'Saturday' ? { open: '10:00', close: '14:00', breakStart: '', breakEnd: '', on: true }
        : d === 'Sunday' ? { open: '00:00', close: '00:00', breakStart: '', breakEnd: '', on: false }
        : defaultSlot();
      base[d] = { ...weekend, id: crypto.randomUUID() };
    });
    return base;
  });

  // Certificates
  const [certificates, setCertificates] = useState([]); // [{id, name, file?, url}]
  const [newCertFiles, setNewCertFiles] = useState([]);

  const tabCounts = {
    profile: 'Profile',
    availability: 'Availability',
    security: 'Security',
    credentials: 'Credentials',
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, me, depts] = await Promise.all([
          getProfile().catch(() => null),
          getMyDoctorProfile().catch(() => null),
          getAllDepartments({ page: 1, limit: 100 }).catch(() => ({ departments: [] })),
        ]);
        const userObj = profileRes || me?.user || user || {};
        setProfile({ ...(profileRes || {}), doctor: me || null });
        setForm((f) => ({
          ...f,
          fullName: userObj.fullName || f.fullName,
          phone: userObj.phone || f.phone,
          email: userObj.email || f.email,
          address: userObj.address || me?.address || f.address,
          gender: userObj.gender || me?.gender || f.gender,
          specialization: me?.specialization || me?.specialty || f.specialization,
          licenseNumber: me?.licenseNumber || me?.license || f.licenseNumber,
          qualifications: Array.isArray(me?.qualifications) ? me.qualifications.join(', ') : me?.qualifications || f.qualifications,
          experience: String(me?.experienceYears || me?.experience || f.experience),
          hospital: me?.hospital || me?.clinic || f.hospital,
          department: me?.departmentId || me?.department?.id || f.department,
          consultationFee: String(me?.consultationFee || me?.fee || f.consultationFee),
          bio: me?.bio || me?.about || f.bio,
        }));
        if (profileRes?.avatar || userObj?.avatar || me?.profilePicture) {
          setAvatarPreview(profileRes?.avatar || userObj?.avatar || me?.profilePicture || '');
        }
        if (Array.isArray(me?.certificates)) {
          setCertificates(
            me.certificates.map((c, i) => ({
              id: `existing-${i}`,
              name: typeof c === 'string' ? `Certificate ${i + 1}` : c.name || `Certificate ${i + 1}`,
              url: typeof c === 'string' ? c : c.url || c.file || '',
            }))
          );
        }
        if (me?.availability && typeof me.availability === 'object') {
          setSlots((prev) => {
            const next = { ...prev };
            DAYS.forEach((d) => {
              const src = me.availability[d] || me.availability[d.toLowerCase()];
              if (src) next[d] = { ...next[d], ...src, id: next[d].id };
            });
            return next;
          });
        }
        setDepartments(depts?.departments || depts || []);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load settings');
      }
    };
    load();
  }, [user]);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }
      const userPayload = {};
      ['fullName', 'phone', 'address', 'gender'].forEach((k) => {
        if (form[k]) userPayload[k] = form[k];
      });
      await updateProfile(userPayload);

      const doctorId = profile?.doctor?.id;
      if (doctorId) {
        const doctorPayload = {
          specialization: form.specialization || undefined,
          licenseNumber: form.licenseNumber || undefined,
          qualifications: form.qualifications ? form.qualifications.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
          experienceYears: form.experience ? Number(form.experience) : undefined,
          hospital: form.hospital || undefined,
          departmentId: form.department || undefined,
          consultationFee: form.consultationFee ? Number(form.consultationFee) : undefined,
          bio: form.bio || undefined,
          availability: slots,
        };
        const fd = toFormData(doctorPayload, { certificates: newCertFiles });
        await updateDoctor(doctorId, fd, { certificates: newCertFiles });
      } else if (newCertFiles.length > 0 || Object.keys(slots).length) {
        toast("Profile saved. Doctor record will sync once onboarding is approved.", { icon: 'ℹ️' });
      }
      toast.success('Profile saved successfully');
      setAvatarFile(null);
      setNewCertFiles([]);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Fill in all password fields.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setPasswordLoading(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword, passwordForm.confirmPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCertFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setNewCertFiles((list) => [...list, ...files]);
    files.forEach((f) => setCertificates((c) => [...c, { id: `new-${Date.now()}-${f.name}`, name: f.name, file: f }]));
    e.target.value = '';
  };
  const removeCert = (id) => {
    setCertificates((c) => c.filter((x) => x.id !== id));
    setNewCertFiles((list) => list.filter((f) => !(`new-${Date.now()}-${f.name}` === id)));
  };

  const toggleDay = (day) => setSlots((s) => ({ ...s, [day]: { ...s[day], on: !s[day].on } }));
  const setSlotField = (day, k, v) => setSlots((s) => ({ ...s, [day]: { ...s[day], [k]: v } }));

  const overviewKpis = [
    { label: 'Account role', value: profile?.user?.role || 'Doctor', sub: 'Signed in identity', icon: ShieldCheck, tone: 'primary' },
    { label: 'Phone', value: form.phone || 'Not set', sub: 'Contact on record', icon: User, tone: 'sky' },
    { label: 'Consultation fee', value: form.consultationFee ? `Rs. ${Number(form.consultationFee).toLocaleString('en-IN')}` : 'Not set', sub: 'Per visit rate', icon: Stethoscope, tone: 'emerald' },
    { label: 'License', value: form.licenseNumber ? (form.licenseNumber.length > 16 ? form.licenseNumber.slice(0, 14) + '…' : form.licenseNumber) : 'Not set', sub: 'Medical council', icon: BadgeCheck, tone: 'amber' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewKpis.map((k) => (
          <StatCard key={k.label} icon={k.icon} label={k.label} value={k.value} sub={k.sub} tone={k.tone} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        {Object.entries(tabCounts).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === key ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
        <div className="ml-auto pr-2">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" /> {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* ============ Profile ============ */}
      {activeTab === 'profile' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard title="Avatar" subtitle="Upload a professional headshot">
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-primary-400 to-primary-700 ring-4 ring-slate-100 dark:ring-slate-800">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-3xl font-extrabold text-white">
                    {(form.fullName || user?.fullName || 'DR').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <Upload className="h-4 w-4" /> Upload photo
                <input type="file" accept="image/*" onChange={handleAvatarPick} className="hidden" />
              </label>
              <p className="text-center text-xs text-slate-400">PNG, JPG up to 5MB. Square crop recommended.</p>
            </div>
          </SectionCard>

          <SectionCard className="lg:col-span-2" title="Personal & professional info" subtitle="Used on your public doctor profile and patient receipts">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Full name</span>
                <input className="input w-full" value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Email</span>
                <input className="input w-full" value={form.email} disabled placeholder="Login email - contact admin to change" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Phone</span>
                <input className="input w-full" value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="+977 98XXXXXXXX" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Gender</span>
                <select className="input w-full" value={form.gender} onChange={(e) => setField('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Address</span>
                <input className="input w-full" value={form.address} onChange={(e) => setField('address', e.target.value)} placeholder="Clinic / street address" />
              </label>

              <div className="h-px sm:col-span-2 border-t border-slate-100 dark:border-slate-800" />

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Specialty</span>
                <input className="input w-full" value={form.specialization} onChange={(e) => setField('specialization', e.target.value)} placeholder="e.g. Cardiology" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">License number</span>
                <input className="input w-full" value={form.licenseNumber} onChange={(e) => setField('licenseNumber', e.target.value)} />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Qualifications</span>
                <input className="input w-full" value={form.qualifications} onChange={(e) => setField('qualifications', e.target.value)} placeholder="MBBS, MD (Internal Med) — comma-separated" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Experience (years)</span>
                <input type="number" min="0" className="input w-full" value={form.experience} onChange={(e) => setField('experience', e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Hospital / clinic</span>
                <input className="input w-full" value={form.hospital} onChange={(e) => setField('hospital', e.target.value)} placeholder="BishwasSetu Teaching Hospital" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Department</span>
                <select className="input w-full" value={form.department} onChange={(e) => setField('department', e.target.value)}>
                  <option value="">Select</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Consultation fee (NPR)</span>
                <input type="number" min="0" className="input w-full" value={form.consultationFee} onChange={(e) => setField('consultationFee', e.target.value)} placeholder="1500" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Professional bio</span>
                <textarea rows={4} maxLength={500} className="input w-full" value={form.bio} onChange={(e) => setField('bio', e.target.value)} placeholder="Short paragraph patients will see on your profile." />
                <p className="mt-1 text-right text-[10px] text-slate-400">{(form.bio || '').length}/500</p>
              </label>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ============ Availability ============ */}
      {activeTab === 'availability' && (
        <SectionCard title="Weekly consultation hours" subtitle="Used by reception to book appointments and shown to patients on public profiles">
          <div className="space-y-3">
            {DAYS.map((day) => {
              const s = slots[day];
              const isWeekend = day === 'Saturday' || day === 'Sunday';
              return (
                <div key={day} className={`rounded-xl border p-4 transition-colors ${s.on ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900' : 'border-slate-200/70 bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/40'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" checked={s.on} onChange={() => toggleDay(day)} className="h-4 w-4 accent-primary-600" />
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                        <Clock3 className="h-4 w-4 text-slate-400" /> {day}
                        {isWeekend && <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Weekend</span>}
                      </span>
                    </label>
                    {s.on && (
                      <button onClick={() => setSlots((ss) => ({ ...ss, [day]: { ...defaultSlot(), id: ss[day].id, on: true } }))} className="text-[11px] font-semibold text-primary-700 hover:underline dark:text-primary-300">
                        Reset
                      </button>
                    )}
                  </div>
                  {s.on && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-4">
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-semibold text-slate-500">Open</span>
                        <input type="time" className="input w-full" value={s.open} onChange={(e) => setSlotField(day, 'open', e.target.value)} />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-semibold text-slate-500">Close</span>
                        <input type="time" className="input w-full" value={s.close} onChange={(e) => setSlotField(day, 'close', e.target.value)} />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-semibold text-slate-500">Break start</span>
                        <input type="time" className="input w-full" value={s.breakStart} onChange={(e) => setSlotField(day, 'breakStart', e.target.value)} />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-semibold text-slate-500">Break end</span>
                        <input type="time" className="input w-full" value={s.breakEnd} onChange={(e) => setSlotField(day, 'breakEnd', e.target.value)} />
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {/* ============ Security ============ */}
      {activeTab === 'security' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard className="lg:col-span-2" title="Change password" subtitle="Use a strong password — minimum 8 characters, mix of letters, numbers and symbols">
            <div className="space-y-4 sm:max-w-lg">
              <label className="block">
                <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400"><KeyRound className="h-3.5 w-3.5" /> Current password</span>
                <input type="password" autoComplete="current-password" className="input w-full" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">New password</span>
                <input type="password" autoComplete="new-password" className="input w-full" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Confirm new password</span>
                <input type="password" autoComplete="new-password" className="input w-full" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))} />
              </label>
              <div className="pt-2">
                <button onClick={handleChangePassword} disabled={passwordLoading} className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-50">
                  <ShieldCheck className="h-4 w-4" /> {passwordLoading ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Account info" subtitle="Identity details on file">
            <dl className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</dt>
                <dd className="rounded-md bg-primary-50 px-2 py-0.5 text-[11px] font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">Doctor</dd>
              </div>
              <div className="flex items-start justify-between gap-2">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">User ID</dt>
                <dd className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-200">{profile?.id || user?.id || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</dt>
                <dd className="mt-1 break-all text-slate-800 dark:text-slate-100">{form.email || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Last login</dt>
                <dd className="mt-1 text-xs text-slate-600 dark:text-slate-300">Now</dd>
              </div>
            </dl>
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Need to change your login email, close your account, or escalate something? Contact the clinic admin desk.
            </div>
          </SectionCard>
        </div>
      )}

      {/* ============ Credentials ============ */}
      {activeTab === 'credentials' && (
        <SectionCard
          title="Certificates & credentials"
          subtitle="Uploaded documents are shared with the clinic to verify and keep on file. Attachments up to 10MB each (PDF / image)."
          action={
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary-600 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-700">
              <Plus className="h-4 w-4" /> Upload certificates
              <input type="file" accept="application/pdf,image/*" multiple onChange={handleCertFiles} className="hidden" />
            </label>
          }
        >
          {certificates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400 dark:border-slate-700">
              <UploadCloud className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-700" />
              No certificates yet — upload at least 1 license / degree for verification.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((c) => (
                <div key={c.id} className="group rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{c.name}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{c.file ? 'New — pending save' : c.url ? 'On file' : '—'}</p>
                    </div>
                    <button onClick={() => removeCert(c.id)} className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-300">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800">
                        <Upload className="h-3.5 w-3.5" /> View
                      </a>
                    )}
                    {c.file && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <BadgeCheck className="h-3.5 w-3.5" /> New upload
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {newCertFiles.length > 0 && (
            <div className="mt-4 rounded-xl border border-primary-200 bg-primary-50/60 p-4 text-xs text-primary-800 dark:border-primary-900/50 dark:bg-primary-900/10 dark:text-primary-200">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">Pending changes</p>
                  <p className="mt-0.5 text-[11px] opacity-90">{newCertFiles.length} new certificate file(s) will be uploaded when you click <strong>Save changes</strong>.</p>
                </div>
                <button
                  onClick={() => {
                    setCertificates((c) => c.filter((x) => !x.file));
                    setNewCertFiles([]);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-semibold text-primary-800 hover:bg-primary-50 dark:bg-slate-900 dark:text-primary-200 dark:hover:bg-slate-800"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Discard new
                </button>
              </div>
            </div>
          )}
        </SectionCard>
      )}
    </div>
  );
};

export default DoctorSettings;
