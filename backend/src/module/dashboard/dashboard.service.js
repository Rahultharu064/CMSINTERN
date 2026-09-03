import prisma from '../../config/database.js'
import { MESSAGES } from '../../constans/messages.js'

// Helper for date range
const getDataRange = (period, startDate, endDate) => {
    let start, end;
    if (startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
    } else {
        const now = new Date();
        start = new Date(now);
        end = now;
        if (period === 'today') {
            start.setHours(0,0,0,0);
        } else if (period === 'week') {
            start.setDate(now.getDate() - 7);
        } else if (period === 'month') {
            start.setMonth(now.getMonth() - 1);
        } else if (period === 'year') {
            start.setFullYear(now.getFullYear() - 1);
        } else {
            start.setMonth(now.getMonth() - 1); // default to 1 month
        }
    }
    return { start, end };
};

const getPatientStatistics = async ({ start, end }) => {
    return prisma.patient.count({
        where: { createdAt: { gte: start, lte: end } }
    });
};

const getDoctorStatistics = async ({ start, end }) => {
    return prisma.doctor.count({
        where: { createdAt: { gte: start, lte: end } }
    });
};

const getAppointmentStatistics = async ({ start, end }, departmentId, doctorId) => {
    const where = { date: { gte: start, lte: end } };
    if (doctorId) where.doctorId = doctorId;
    
    const [total, completed, cancelled, pending] = await Promise.all([
        prisma.appointment.count({ where }),
        prisma.appointment.count({ where: { ...where, status: 'COMPLETED' } }),
        prisma.appointment.count({ where: { ...where, status: 'CANCELLED' } }),
        prisma.appointment.count({ where: { ...where, status: 'SCHEDULED' } }),
    ]);
    return { total, completed, cancelled, pending };
};

const getDepartmentStatistics = async ({ start, end }) => {
    return prisma.department.count({
        where: { createdAt: { gte: start, lte: end } }
    });
};

const getRevenueStatistics = async ({ start, end }) => {
    const result = await prisma.bill.aggregate({
        where: { generatedAt: { gte: start, lte: end }, status: 'PAID' },
        _sum: { totalAmount: true }
    });
    return { total: result._sum.totalAmount || 0 };
};

const getBillingStatistics = async ({ start, end }) => {
    const where = { generatedAt: { gte: start, lte: end } };
    const [totalInvoices, paidInvoices, pendingInvoices] = await Promise.all([
        prisma.bill.count({ where }),
        prisma.bill.count({ where: { ...where, status: 'PAID' } }),
        prisma.bill.count({ where: { ...where, status: 'UNPAID' } })
    ]);
    return { totalInvoices, paidInvoices, pendingInvoices };
};

const getMedicalRecordStatistics = async ({ start, end }) => {
    return prisma.medicalRecord.count({
        where: { createdAt: { gte: start, lte: end } }
    });
};

// get dashboard  statistics\
export const getDashboardStatistics = async (filters={})=>{
    const {period, startDate, endDate, departmentId, doctorId} = filters;

    /// calculate data based on period 
    const dataRange = getDataRange(period, startDate, endDate);
    
    // get all statistics in parallel
    const [patientstats, doctorstats, appoinmentstats, departmentstats, revenuestats, billingstats, medicalRecordStats] = await Promise.all([
        getPatientStatistics(dataRange),
        getDoctorStatistics(dataRange),
        getAppointmentStatistics(dataRange, departmentId, doctorId),
        getDepartmentStatistics(dataRange),
        getRevenueStatistics(dataRange),
        getBillingStatistics(dataRange),
        getMedicalRecordStatistics(dataRange)
    ]);

    return {
        patientstats,
        doctorstats,
        appoinmentstats,
        departmentstats,
        revenuestats,
        billingstats,
        medicalRecordStats
    }
}


