import { validationResult } from "express-validator";
import invoiceService from "../service/invoice_service";

const getAllInvoice=async(req,res)=>{
    try {
        const rs=await invoiceService.getAllInvoice();
        if(rs.status){
            return res.status(200).json({result:rs.result});
        }else{
            return res.status(500).json({error_code:rs.msg});
        }
    } catch (error) {
        return res.status(500).json({error_code:error})
    }
}

const insertInvoice=async(req,res)=>{
    const validate=validationResult(req);
    if(!validate.isEmpty()){
        return res.status(400).json({error_code:validate.errors[0].msg});
    }
    let id_payment,id_customer,receipt_date,payment_date,deposit,total_payment,note;
    try {
        id_payment=req.body.id_payment,
        id_customer=req.body.id_customer,
        receipt_date=req.body.receipt_date,
        payment_date=req.body.payment_date,
        deposit=req.body.deposit,
        total_payment=req.body.total_payment,
        note=req.body.note
    } catch (error) {
        return res.status(500).json({error_code:error})
    }
    const newInvoice={
        id_payment:id_payment,
        id_customer:id_customer,
        receipt_date:receipt_date,
        payment_date:payment_date,
        deposit:deposit,
        total_payment:total_payment,
        note:note
    }
    const rs=await invoiceService.insertInvoice(newInvoice);
    if(rs.status){
        return res.status(201).json({result:rs.result});
    }else{
        return res.status(500).json({error_code:msg});
    }
}

const updateInvoice=async(req,res)=>{
    let id_payment,id,receipt_date,payment_date,deposit,total_payment,note;
    try {
        id_payment=req.body.id_payment==""?null:req.body.id_payment,
        id=req.body.id,
        receipt_date=req.body.receipt_date==""?null:req.body.receipt_date,
        payment_date=req.body.payment_date==""?null:req.body.payment_date,
        deposit=req.body.deposit==""?null:req.body.deposit,
        total_payment=req.body.total_payment==""?null:req.body.total_payment,
        note=req.body.note==""?null:req.body.note;
    } catch (error) {
        return res.status(500).json({error_code:error})
    }
    const newInvoice={
        id_payment:id_payment,
        id:id,
        receipt_date:receipt_date,
        payment_date:payment_date,
        deposit:deposit,
        total_payment:total_payment,
        note:note
    }
    const rs=await invoiceService.updateInvoice(newInvoice);
    if(rs.status){
        return res.status(200).json({result:rs.result});
    }else{
        return res.status(500).json({error_code:msg});
    }
}

const deleteInvoice=async(req,res)=>{
    try{
        const id=req.body.id;
        const rs=await invoiceService.deleteInvoice(id);
        if(rs.status){
            return res.status(200).json({result:rs.result});
        }else{
            return res.status(500).json({error_code:msg});
        }
    }catch(error){
        return res.status(500).json({error_code:error})
    }
}

module.exports={
    getAllInvoice, insertInvoice, updateInvoice, deleteInvoice
}