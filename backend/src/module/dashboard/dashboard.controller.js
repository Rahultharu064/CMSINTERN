import * as dashboardService from './dashboard.service.js';
import catchAsync from '../../utils/catchAsync.js';

export const getDashboardStats = catchAsync(async (req, res) => {
    // Optional filters from query params
    const { period, startDate, endDate, departmentId, doctorId } = req.query;

    const stats = await dashboardService.getDashboardStatistics({
        period,
        startDate,
        endDate,
        departmentId,
        doctorId
    });

    res.status(200).json({
        success: true,
        message: 'Dashboard statistics fetched successfully',
        data: stats
    });
});
