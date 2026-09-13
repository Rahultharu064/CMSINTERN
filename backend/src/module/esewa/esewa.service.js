import prisma from "../../config/database.js";
import { ENV } from "../../config/env.js";
import { esewa } from "../../config/esewa.js";





//inititate ESEWA payment
export const initiateEsewaPayment = async(paymentData) =>{
    const {amount, purchaseOrderId , purchaseOrderName, customerName, customerEmail, customerPhone, paymentType , referenceId} = paymentData

    // validate payment type and refernce
    let reference = null;
    let patientId = null;
    let userId = null;


    if (paymentType === "APPOINTMENT" && referenceId){
        const appoinment = await prisma.appointment.findUnique({
            where:{id:referenceId},
            include:{
                patient:{
                    include:{
                user:true
            }
        }
        }
        })
        if(!appoinment){
            throw new Error("Appointment not found ")
        }
        reference= appointment;
        patientId = appointment.patientId;
        userId = appointment.patient.userId;

    }
    else if(paymentType === "BILL" && referenceId){
        const bill = await prisma.bill.findUnique({
            where:{id:referenceId},
            include:{
                patient:{
                    include:{
                        user:true,
                    }
                }
            }
        });
        if(!bill){
            throw new Error("Bill not found")
        }
        if(bill.status === "PAID"){
            throw new Error("Bill is already paid")
        }
        reference= bill;
        patientId=bill.patientId;
        userId= bill.patient.userId;
    }
    else {
        throw new Error("Invlaid payment type or reference Id")
    }


    // generate transaction UUID
    const transactionUuid = `TXN-${Date.now()}-${Math.random().toString(36).substring(2,8).toUpperCase()}`  // unique transaction uuid genrated 
    // create payment record 
    const paymentRecord = await prisma.payment.create({
        data:{
            billId:paymentType === 'BILL' ? referenceId:null,
            amount:amount,
            method:"ESEWA",
            status:"PENDING",
            notes:`${paymentType} payment via esewa`,
            transactionId:transactionUuid
        }
    })

    /// initiate esewa payment 
    try{
        const paymentUrl = await esewa.initiatePayment({
            amount:String(amount),
            total_amount:String(amount),
            transaction_uuid:transactionUuid,
            product_code:ENV.ESEWA_PRODUCT_CODE,
            product_service_charge:'0',
            product_delivery_charge:"0",
            tax_amount:"0",
            success_url:ENV.ESEWA_SUCCESS_URL,
            failure_url:ENV.ESWA_FAILURE_URL,
            signed_filed_names:
        })
    }
}